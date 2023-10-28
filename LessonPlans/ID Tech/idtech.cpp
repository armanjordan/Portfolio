/******************************************************************************

                              Online C++ Compiler.
               Code, Compile, Run and Debug C++ program online.
Write your code in this editor and press "Run" button to compile and execute it.

*******************************************************************************/

#include <iostream>
#include <cmath>

using namespace std;

class Data {
protected:
    string name;
    int value;
    
public:
    Data (const string& d = "", int v = 0) {
        name = d;
        value = v;
    }

    string get_name() {
        return name;
    }
    
    int get_value() {
        return value;
    }
    
    void set_name(string s){
        name = s;
    }
    
    void set_value(int v){
        value = v;
    }
    
    string operator + (const Data& other) const {
        return to_string(value + other.value);
    }
};

Data* addToValue(Data* d, int i) {
    d->set_value(d->get_value() + i);
    return d;
}


class DataExponent : Data {
private:
    int exponent;

public:
    DataExponent (const string& d = "", int v = 0, int ex = 0) : Data(d, v) {
        exponent = ex;
    }

    int power() {
        return std::pow(value, exponent);
    }
};

int main() {
    cout<< "Hello World" << endl;
    
    Data d1("Even", 4);
    Data d2("Odd", 5);
    
    cout << "D1 name is: " << d1.get_name() << ", and value is: " << to_string(d1.get_value()) << endl;
    cout << "D2 name is: " << d2.get_name() << ", and value is: " << to_string(d2.get_value()) << endl;
    
    addToValue(&d2, 4);
    
    cout << "The value of D2 is now: " << d2.get_value() << endl;
    
    cout << "The value of D1 and D2 summed together is: " << (d1 + d2) << endl;


    // stretch:

    DataExponent de("Exponent", 2, 3);

    cout << "De pow is: " << to_string(de.power()) << endl;

    return 0;
}




// ---------------------------------------------------------------------




// Online C++ compiler to run C++ program online
#include <iostream>

int magic_number(int a) {
    return 5 + a;
}

int main() {
    // Write C++ code here
    std::cout << "Hello world!" << std::endl;
    
    int my_number = 5;
    
    for (int i = 0; i < 5; i++) {
        my_number = magic_number(my_number);
    }
    
    std::cout << "my_number = " << my_number << std::endl;
    if (my_number > 25) {
        std::cout << "My number is greater than 25." << std::endl;
    }

    return 0;
}
