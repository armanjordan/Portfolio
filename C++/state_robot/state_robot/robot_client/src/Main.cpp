
// From here : https://www.geeksforgeeks.org/socket-programming-cc/

#include <iostream>

#include <string.h>   //strlen 
#include <stdlib.h> 
#include <errno.h> 
#include <unistd.h>   //close 
#include <arpa/inet.h>    //close 
#include <sys/types.h> 
#include <sys/socket.h> 
#include <netinet/in.h> 
#include <sys/time.h> //FD_SET, FD_ISSET, FD_ZERO macros 

#include <thread>

#include <chrono>
#include <cstdint>
#include <iostream>

#include "../include/Message.h"
     
#define TRUE   1 
#define FALSE  0 
#define PORT 8888 
    
// helper func to give you the current time(7B-24)
uint64_t timeSinceEpochMillisec() {
    using namespace std::chrono;
    return duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
}

int main(int argc, char const* argv[])
{
    int status, valread, client_fd;
    struct sockaddr_in serv_addr;

    char buffer[1024] = { 0 };
    if ((client_fd = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
	    std::cout << "\n Socket creation error \n" << std::endl;
        return -1;
    }
  
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);
  
    // Convert IPv4 and IPv6 addresses from text to binary
    // form
    if (inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr)
        <= 0) {
        std::cout <<  
            "\nInvalid address/ Address not supported \n" << std::endl;
        return -1;
    }
  
    if ((status
         = connect(client_fd, (struct sockaddr*)&serv_addr,
                   sizeof(serv_addr)))
        < 0) {
	    std::cout << "\nConnection Failed \n" << std::endl;
        return -1;
    }

    // ------ after connection is established: ------

	// generate message
    small_world::SM_Event message;
    message.set_event_type("tick");

    // initialize string to store serialized msg
    std::string serialized;

	// tick loop
    while (true) {
        // use sleep here
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        
        // after it wakes from sleep, set time
        message.set_event_time(timeSinceEpochMillisec());

        // serialize
        message.SerializeToString(&serialized);

        // send
        send(client_fd, serialized.c_str(), serialized.length(), 0);
    }

    // closing the connected socket
    close(client_fd);
    return 0;
}
