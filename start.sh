ganache-cli -h  0.0.0.0 -p 7545 -i 5777 --db ./components -m "unable churn hurt damp update decorate boost depend frame citizen effort visit" -d &
sleep 5
echo ganache launched, now launching node
cd ./client
npm start > output.txt &
echo Node is now running