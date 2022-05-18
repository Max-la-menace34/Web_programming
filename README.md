# MMMDE4IN13-21-Maxime-Raillat

1st step: Need to clone the github repo

    git -- version (if not, sudo apt-get install git)
    git colne <the name of tour repo>  #example : https://github.com/EPF-MDE/MMMDE4IN13-21-Maxime-Raillat.git

  

Now you have the directory on your own machine, you we able to run it but before we need to install other tools.


2nd step : Install Node Version Manager

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash 
  
  If curl is not working use : wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  
  
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
 
Then : 
    
    nvm install node
  
  
3rd step : Running with PM2

Install PM2:

        npm i --save --global pm2
        


4th step : Install nginx

        sudo apt-get install nginx
        
5th step : To run the server go to the repo:

cd/your/repo/path

Then run the command :

        Run pm2 start app.js
        
or 

            npm run dev

If you have some errors, go to the dependencies and install the missing one :
cd/your/repo/path

            npm install
 
The command for pm2 are :

 Run (#, open http://localhost:3000)
 
       pm2 start app.js 
       
 Run (#, you'll see your server logs)
 
       pm2 logs 
       
 Run (#, you'll see your server) 
 
       pm2 list 
       
 Run (#, will stop the server)
 
       pm2 stop app 

Now you are ready to go!

Connect to http://localhost:3000 and enter test for username and test for password

  If you have any probleme : maxime.raillat@epfedu.fr.

