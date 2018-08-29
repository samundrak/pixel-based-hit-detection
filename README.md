# pixel-based-hit-detection

Sample of pixel based hit detection where we watch certain pixel to find out if hit detection.

# How it works

Get image data of canvas from search for first breakpoint pixel whoose color is other then alpha and then store it somewhere, like this way we will store all pixels which have any other colors except alpha(breakpoint) and whenever and object moves
in canvas we check the pixel color of breakpoints and if the color of breakpoints is other than alpha then its hit detection.

# Demo

![Demo](demo.gif)

# Run

- Clone it
- `npm i`
- `npm start`
