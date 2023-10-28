// Online C++ compiler to run C++ program online
#include <iostream>
#include <string>
#include <vector>
#include <typeinfo>

using namespace std;

class Character;

class GameObject {
protected:
    string name;
    double price;

public:
    void setName(string pName) {
        name = pName;
    }

    string getName() {
        return name;
    }

    void setPrice(double pPrice) {
        price = pPrice;
    }

    double getPrice() {
        return price;
    }
    
    virtual void use(Character* character) = 0;
    
    void display() {
        cout << name << endl;
    }
};

class Character {
private:
    string name;
    int health;

public:
    vector<GameObject*> inventory;

    Character(string pName, int pHealth){
        name = pName;
        health = pHealth;
    }

    void addToInventory(GameObject* obj) {
        inventory.push_back(obj);
    }
    
    void removeFromInventory(GameObject* obj) {
        // implement
    }

    void displayInventory() {
        cout << "----- " << name << "'s inventory -----" << endl;
        cout << "Health: " << health << endl;
        for (GameObject* obj : inventory) {
            obj->display();
        }
        cout << "-----------------------------" << endl;
    }

    int getHealth() {
        return health;
    }
    
    string getName() {
        return name;
    }

    void setHealth(int pHealth) {
        health = pHealth;
    }
};

class Potion : public GameObject {
private:
    int health;

public:
    Potion(string name, double price, int pHealth) {
        health = pHealth;
        setName(name);
        setPrice(price);
    }

    void use(Character* character) override {
        std::cout << "Using potion " << getName() << " to restore " << health << " health." << std::endl;
        character->setHealth(character->getHealth() + health);
    }
};

class Sword : public GameObject {
private:
    int damage;

public:
    Sword(string name, double price, int pDamage){
        damage = pDamage;
        setName(name);
        setPrice(price);
    }

    void use(Character* character) override {
        std::cout << "Using sword " << getName() << " to attack " << character->getName() << std::endl;
        character->setHealth(character->getHealth() - damage);
    }
};

int main() {
    // create a character
    Character* hero = new Character("Arman", 100);
    
    // give him a sword and a potion
    Potion small_potion("small potion", 50, 20);
    Sword wooden_sword("wooden sword", 75, 20);
    
    hero->addToInventory(&small_potion);
    hero->addToInventory(&wooden_sword);
    
    // display inventory
    hero->displayInventory();
    
    
    
    // gameplay
    string action;
    cout << "Specify an Action: ";
    getline(cin, action);

    // use an item
    if (action.substr(0, 4) == "use ") {
        string itemName = action.substr(4);
        
        for (int i = 0; i < (hero->inventory).size(); i++) {
            if ((hero->inventory)[i]->getName() == itemName) {
                // you have the item
                
                // if its the potion
                if ((hero->inventory)[i]->getName() == "small potion") {
                    ((hero->inventory)[i])->use(hero);
                    continue;
                }
                
                
                /*
                // if its a potion
                if (typeid((hero->inventory)[i]) == typeid(Potion)) {
                    ((hero->inventory)[i])->use(hero);
                    cout << "Does it get here?" << endl;
                    // (hero->inventory).erase(i);
                    continue;
                }
                
                // if its a sword
                if (typeid((hero->inventory)[i]) == typeid(Sword)) {
                    string target;
                    
                    cout << "What do you use the sword on: ";
                    cin >> target;
                    cout << "You use sword on " << target << endl;
                }
                */
            }
        }
        // otherwise, you dont
    }
    
    hero->displayInventory();
    

    return 0;
}