## Trip Planner Project with MERN stack

A place where people can plan trips together, you can invite as many friends as you want and vote for the best places to go, all the information changes live.

Visit on: <a href='https://www.tripplanet.org'>www.tripplanet.org</a>

## Functionality

You can create your trip which requires a name, you can add a picture but it's optional, and inside of each trip you have the following options to add and vote for: restaurants, stays, activities, and the actual destination (the country you're going to).

The Person who created the trip can invite people by their emails, a remainder that the user must be registered to be able to be invited to any trip

As the Admin adds destinations to all parts of the trip, travelers can participate on a live voting for their favorite ones.

The Admin can make other travelers an Admin so they can help on adding new locations to all their friends to vote for

All functions happen immediately because of socket.io, so removing an user from the trip will cause their page to refresh at the same time.

## How to start the Applications

1. Run npm install from the root directory
2. cd into frontend and run npm install 
3. from the root directory run the followings:
4. npm run server
5. npm run client
6. npm run socket


## API KEYS

you need to get your api key for google maps places api and mongodb key so everything is functional


## What could I have done better ?

1. lack of organization with socket.io, because I didn't have enough time I ended up just wanting to get things done instead of following best practices.

2. document your code and thoughts during development not at the end of it, writing clean code helps but is still good to document your code.

3. being used to building smaller applications from tutorials gave me the false impression of how long it actually takes to build something 100% on your own, be realistic with yourself.

