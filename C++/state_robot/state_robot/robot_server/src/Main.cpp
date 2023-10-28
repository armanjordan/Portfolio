#include <iostream>
#include <map>

#include <string>  

#include <stdlib.h> 
#include <errno.h> 
#include <unistd.h>    

#include <arpa/inet.h>     
#include <sys/types.h> 
#include <sys/socket.h> 
#include <netinet/in.h>

#include <memory>

#include "../include/Message.h"

#define PORT 8888

#include <chrono>
#include <cstdint>

// Function to grab the current time
uint64_t timeSinceEpochMillisec() {
    using namespace std::chrono;
    return duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
}

// Takes in an event (which is deserialized in server) and assigns
// last_tick_time to event_time
class Tickable {

    uint64_t last_tick_time = 0;

    public:

        virtual void tick(const small_world::SM_Event & event) {
            last_tick_time = event.event_time();
        }
};

class StateMachine;

class RobotState {
public:
    uint64_t initial_time = 0;
    uint64_t current_time = 0;
    std::map<std::string, std::shared_ptr<RobotState>> next_states;
    std::shared_ptr<StateMachine> owner;

    uint64_t get_elapsed() {
        return current_time - initial_time;
    }

    void set_next_state(const std::string & state_name, std::shared_ptr<RobotState> state) {
        next_states[state_name] = state;
    }

    void set_owner_name(std::shared_ptr<StateMachine> o) {
        owner = o;
    }

    std::shared_ptr<RobotState> get_next_state(const std::string & transition_name) {
        std::map<std::string, std::shared_ptr<RobotState>>::iterator it = next_states.find(transition_name);
        if (it == next_states.end()) 
            return nullptr;
        return it->second;
    }

    virtual void tick(const small_world::SM_Event & e) {
        if (initial_time == 0)
            initial_time = e.event_time();
        current_time = e.event_time();
        decide_action(get_elapsed());
    }

    virtual void decide_action(uint64_t elapsed) = 0;
};

// state machine that manages the robot states
class StateMachine : public Tickable {
    // keeps track of the current state
    std::shared_ptr<RobotState> current_state;

    public:

        // takes in an event, calls the Tickable tick to get the time,
        // then if the current state isnt null, calls that RobotStates tick()
        virtual void tick(const small_world::SM_Event & event) {
            Tickable::tick(event);
            if (current_state != nullptr) {
                current_state->tick(event);
            }
        }

        // function to set the state
        virtual void set_current_state(std::shared_ptr<RobotState> cs) {
            current_state = cs;
            cs->initial_time = 0;
        }
};

class TimedState : public RobotState {
public:
    std::string state_name;
    std::string verb_name;
    uint64_t time_to_wait = 30000;

    void set_time_to_wait (uint64_t i) {
        time_to_wait = i;
    }
    void set_state_name(const std::string & name) {
        state_name = name;
    }
    void set_verb_name(const std::string & name) {
        verb_name = name;
    }
    std::string get_state_name() {
        return state_name;
    }

    virtual void decide_action(uint64_t duration) {
        if (duration < time_to_wait) {
            std::cout << verb_name << std::endl;
            return;
        }
        std::shared_ptr<RobotState> next = get_next_state("done");
        if (next == nullptr) {
            std::cout << "Can't get a next state to go to" << std::endl;
            return;
        }
        std::cout << std::static_pointer_cast<TimedState>(next)->get_state_name() << std::endl;
        owner->set_current_state(next);
    }
};


int main(int argc, char * argv[]) {

	// use these strings to indicate the state transitions
	// the robot progresses through.  Do not modify these strings

	std::string robot_waiting = "The robot is waiting";
	std::string robot_moving = "The robot is moving";

	std::string robot_finished_waiting = "The robot finished waiting";
	std::string robot_finished_moving = "The robot finished moving";

	std::string robot_began_waiting = "The robot began waiting";
	std::string robot_begin_moving = "The robot begin moving";

    // create the state machine

    // create the managing state machine
    std::shared_ptr<StateMachine> sm = std::make_shared<StateMachine>();

    // create the robots first state, waiting
    std::shared_ptr<TimedState> s0 = std::make_shared<TimedState>();
    s0->set_state_name(robot_began_waiting);
    s0->set_verb_name(robot_waiting);
    s0->set_owner_name(sm);

    // create the robots second state, moving
    std::shared_ptr<TimedState> s1 = std::make_shared<TimedState>();
    s1->set_state_name(robot_begin_moving);
    s1->set_verb_name(robot_moving);
    s1->set_owner_name(sm);

    // create the robots next states
    s0->set_next_state("done", s1);
    s1->set_next_state("done", s0);

    // set the robot to the waiting state
    sm->set_current_state(s0);

	int opt = true;
    int master_socket, addrlen, new_socket, client_socket[30], 
          max_clients = 30, activity, valread, sd;  
    int max_sd;
    struct sockaddr_in address;  

    char buffer[1025];  //data buffer of 1K + one byte for a NUL terminator  

    std::cout << "Echo server running on port : " << PORT << std::endl;
    std::cout << "Use telnet localhost " << PORT << " to connect" << std::endl;
    std::cout << "If connecting from outside the VM, you will need another port fwd" << std::endl;

    // set of socket descriptors 
    fd_set readfds;

    std::string message = "Hello from ECHO Daemon v1.0";

    // initialise all of the client_socket[] array to 0 (not checked) 
    for (size_t i = 0; i < max_clients; i++) {  
        client_socket[i] = 0;  
    }

    //create a master socket 
    if( (master_socket = socket(AF_INET , SOCK_STREAM , 0)) == 0) {  
		std::cerr << "socket failed" << std::endl;  
        exit(EXIT_FAILURE);  
    }  

    //set master socket to allow multiple connections , 
    //this is just a good habit, it will work without this 
    if( setsockopt(master_socket, SOL_SOCKET, SO_REUSEADDR, (char *)&opt, 
          sizeof(opt)) < 0 ) {  
		std::cerr << "setsockopt" << std::endl;  
        exit(EXIT_FAILURE);  
    }  

    //type of socket created 
    address.sin_family = AF_INET;  
    address.sin_addr.s_addr = INADDR_ANY;  
    address.sin_port = htons( PORT );  

    //bind the socket to localhost port 8888 
    if (bind(master_socket, (struct sockaddr *)&address, sizeof(address)) < 0) {  
		std::cerr << "bind failed" << std::endl;  
        exit(EXIT_FAILURE);
    }  

    std::cout << "Listener on port : " << PORT << std::endl;  

    // specify a maximum of 3 pending connections for the master socket 
    if (listen(master_socket, 3) < 0) {
	std::cerr << "error listening" << std::endl;  
        exit(EXIT_FAILURE);  
    }

    addrlen = sizeof(address);  
    std::cout << "Waiting for connections ..." << std::endl;  

    while(true) {
        //clear the socket set 
        FD_ZERO(&readfds);

        //add master socket to set 
        FD_SET(master_socket, &readfds);  
        max_sd = master_socket;  

        //add child sockets to set 
        for (size_t i = 0 ; i < max_clients ; i++) {  
            //socket descriptor 
            sd = client_socket[i];

            //if valid socket descriptor then add to read list 
            if(sd > 0)
                FD_SET( sd , &readfds);

            //highest file descriptor number, need it for the select function 
            if(sd > max_sd)  
                max_sd = sd;  
        }  

        //wait for an activity on one of the sockets , timeout is NULL , 
        //so wait indefinitely

		// EXPLAINED: 
		// select is on readfds, which at the start is just the master socket.
		// the master socket has been configured and linked above to PORT 8888
		// which is also what the client is connected to in robot_client. This
		// makes it so that when the program starts, once the client connects
		// this select function will stop waiting because master socket will
		// detect a connection (it's accessed in readfds by max_sd), and activity
		// holds the number of available sockets ready for reading.

        activity = select( max_sd + 1 , &readfds , NULL , NULL , NULL);  

        if ((activity < 0) && (errno!=EINTR)) {
			std::cout << "select error" << std::endl;
        }

        // If something happened on the master socket, 
        // then its an incoming connection 
        if (FD_ISSET(master_socket, &readfds)) {  
            if ((new_socket = accept(master_socket, 
                    (struct sockaddr *)&address, (socklen_t*)&addrlen))<0) {  
				std::cout << "accept error" << std::endl;  
                exit(EXIT_FAILURE);  
            }
 
            // inform user of socket number - used in send and receive commands 
	        std::cout << "New connection , socket fd, ip port " 
                  << new_socket  << "," << inet_ntoa(address.sin_addr)  << ntohs(address.sin_port) << std::endl;  

	        // convert std::string to char *
	        char * cstr = message.data();

            //send new connection greeting message 
            if( send(new_socket, cstr, message.size(), 0) != message.size() ) {  
                std::cout << " error sending" << std::endl;  
            }  

	        std::cout << "Welcome message sent successfully" << std::endl;  

            //add new socket to array of sockets 
            for (size_t i = 0; i < max_clients; i++) {  
                //if position is empty 
                if( client_socket[i] == 0 ) {  
                    client_socket[i] = new_socket;  
		    		std::cout << "Adding to list of sockets as : " << i << std::endl;
                    break;  
                }
            }
        }

        // It is some sort of IO operation on some other socket
        for (size_t i = 0; i < max_clients; i++) {  
            sd = client_socket[i];  

            if (FD_ISSET( sd , &readfds)) {  
                // Check if it was closing and also read the incoming message 
                if ((valread = read( sd , buffer, 1024)) == 0) {  
                    //Somebody disconnected, get their details and print 
                    getpeername(sd , (struct sockaddr*)&address , \
                        (socklen_t*)&addrlen);  
		    		std::cout << "Host disconnected :"  
                        << inet_ntoa(address.sin_addr) << "," << ntohs(address.sin_port) << std::endl;  
                         
                    // Close the socket and mark as 0 in list for reuse 
                    close( sd );  
                    client_socket[i] = 0;
                    FD_CLR(sd, &readfds);
                }  

                else { 

					// succesfully read in the message

					// create message to hold whats read in
    				small_world::SM_Event message;
					message.ParseFromString(buffer);
                    // state machine calls tick with the message it received
                    sm->tick(message);
                }  
            }  
        }  
    }  

	return EXIT_SUCCESS;
}
