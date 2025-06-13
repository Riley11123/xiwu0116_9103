# xiwu0116_9103
# Mondrian Canvas - Interactive Artwork

An interactive p5.js sketch inspired by Piet Mondrian’s compositions. Users can draw lines, fill colors, and build their own dynamic Mondrian-style artworks through simple mouse interactions.

## Interaction Instructions

**Rule 1:** Click on the edges of the canvas to add straight lines. Once there are more than 5 lines, rectangles can be created.

**Rule 2:** Double-click on a rectangle formed between the lines to fill it with red, yellow, or blue. Double-click again to change the color.

**Rule 3:** Long-press on a filled rectangle for 2 seconds to turn it white and lock it (this prevents further color changes).

**Rule 4:** Click on any blank area to begin drawing.

## User Input & Interaction Design

I chose to use user input to drive my code. In my view, mouse interaction is one of the most direct and engaging ways to connect with the screen. By clicking, dragging, or long pressing, users can interact with the computer and leave visible marks. This creates a combined experience of both action and visual response.

## Animation Processing and Differences

I will create animation by changing the positions of lines and rectangles, as well as the colors of the rectangles, turning the interaction into a game-like experience. I will provide a blank canvas where users can freely explore—drawing lines and rectangles to create their own Mondrian-style compositions. Unlike other group members who simply play an animated scene, I’m offering an interactive blank canvas that allows users to use the mouse to create the animation themselves—step by step—like playing a game, building their own unique Mondrian artwork.

## Sources of Inspiration and Influence

My inspiration comes from Mondrian's works Composition with Red, Blue and Yellow and Broadway Boogie Woogie. I was deeply drawn to the use of lines and color in Composition with Red, Blue and Yellow—the artist constructed the composition using bold black lines and rectangles in the three primary colors: red, yellow, and blue. This inspired the visual language I implemented in my code. Meanwhile, Broadway Boogie Woogie features a freer rhythm and a more complex grid structure, transforming the artwork from a purely static image into something more like an abstract map filled with movement and rhythm. This inspired me to incorporate interactivity into my work—allowing users to dynamically add lines with mouse clicks to freely divide the canvas, and to use color changes and long-press locking as ways to inject a sense of “rhythm” and “control” into the piece, as if having a dialogue with the painting itself.

- **[Composition with Red, Blue and Yellow](https://en.wikipedia.org/wiki/Composition_with_Red_Blue_and_Yellow)**: The bold black lines and primary color blocks became the visual foundation for this code.
- **[Broadway Boogie Woogie](https://en.wikipedia.org/wiki/Broadway_Boogie_Woogie)**: Its rhythmic and map-like structure inspired the free, interactive division of space and the dynamic addition of lines and colors.

## Technical Description

In my code, I used several functions to add interactivity and a sense of animation to what was originally a static Mondrian-style composition. For example, in mousePressed(), when I click near the edge of the canvas, a new line is added, and the screen is redrawn. This makes it feel like the lines are growing step by step. Then, in doubleClicked(), if I double-click between two lines, a random color is applied to the rectangle formed there. I can even double-click again to change it to another color, which creates an animated effect of color shifting. Long-pressing a block turns it white and locks it so it no longer changes. Although the overall composition is static, these interactive actions allow the user to “perform” the creation of their own layout step by step—giving them control over composing a Mondrian-style artwork.

