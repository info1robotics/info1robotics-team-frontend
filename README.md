# QuickDash - Frontend

Tracking for safety and efficiency  
Currently we are facing a difficult situation and we need every mean possible to keep up our progress. For the purpose of teams using their labs according to safety rules we give you an app that allows you to see who is working in your space and when.  
Easy to use and accesible to the large public we wish to make this season easier for as many people as possible.  

## Install


1. Donload and configure the backend: https://github.com/info1robotics/info1robotics-team-backend
2. Download ```main``` branch.
3. Create ```constants.js``` file in the the directory root with the following contents:
```
export default {
    BACKEND_IP: "ip public backend",
    BACKEND_PORT: "port backend; recomandat 5002"
};
```
4. Run ```npm start```.
5. To access the website, use port ```3000```.

## How to use 

- To enter the lab go to **Lab visits**, select if you are with someone or alone and press **Enter Lab**
- To exit go to **Lab visits** and press **Exit Lab**
- If you do not have an account you need an invitation from an admin. If you have one you need to go to **Register**, enter your username, name, email and password. 

### Admin permissions:
- You can go to **Admin** and see a list of all users
- You can go to **Adimin** and download all visits as an ```.xlsx``` file
- To invite new users you can go to **Admin**, press **Invite Users** and enter their email.
- You can give or remove admin permissions to users.


