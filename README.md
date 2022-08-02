# Smart-Sponsor-v3

This is the code of Christoph Schriever's Bachelor thesis. For a version that is easier to use refer to the docker image found at https://hub.docker.com/repository/docker/cschriever/smart-sponsor-final
- install docker, MetaMask for Chrome
- docker run -dp 3000:3000 -p 7545:7545 -it cschriever/smart-sponsor-final
- First Time setup for a container: 
	- bash
	- ./setup.sh
- After restarting a container:
	- bash
	- ./start.sh
- MetaMask settings
  - RPC-URL: http://localhost:7545
  - Chain-ID: 1337
- After using a new container the metamask account might need to be reset under the meta mask advanced settings. This is
the case if the error listed in the console mentions the nonce being incorrect.
