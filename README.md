# dynamicNodeJitter

Copy the sketch.js file and paste into the editor playground at https://editor.p5js.org or open the index.html file for the experience in a web browser.

This p5.js code creates an interactive canvas with multiple elements: a gradient background to simulate diffused sunlight,
a shape with dynamic nodes responsive to the cursor, small moving particles that jitter upon mouse hover,
and a dynamic chain that creates a wavy undulating visual that jitters when the cursor is near.
The entire visual responds to mouse movement, creating a dynamic, and organic experience.
Here's a detailed explanation of the code:

1.	Constants and variables: Sets up various constants and variables for the program, including parameters for the waves, particles, and the shape.

2.	Particle class: Defines a Particle class to create, move, and join particles. It also contains a tickle() method,
    which makes particles jitter when they are close to the mouse cursor.

3.	setup(): Initializes the canvas, sets the frame rate, color mode, and initializes arrays and variables related to waves, particles, and the shape.

4.	draw(): The main loop that updates the canvas, calling functions to draw the gradient background, shape, particles, and wave pattern.

5.	drawGradient(): Creates a gradient background using a for loop to interpolate colors between the start and end colors and applies it to the canvas.

6.	drawShape(): Draws the shape with nodes that move based on the mouse position and tickles nodes close to the mouse cursor.

7.	calculateNodePositions(): Calculates the position of each node based on the center of the shape and its radius.

8.	moveShape(): Moves the shape based on the mouse position, applying a springiness effect and a damping factor.
    Also, updates the organicConstant variable based on the acceleration of the shape.

9.	renderParticles(): Renders and moves particles on the canvas, and optionally joins them with lines if desired (commented out by default).

10.	calculateWave(): Calculates the y-values for the wave pattern based on multiple sine and cosine functions with varying amplitudes and periods.

11.	renderWave(): Renders the wave-like pattern on the canvas using the calculated y-values.
