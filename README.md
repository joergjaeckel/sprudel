# sprudel

This is meant to be a nice and flexible Particle System for three.js. In its core it utilizes ```miniplex``` as ECS. 

## Core Concepts

Every particle is represented as entity in an ECS world. It's components holds all the data needed to simulate the particle behaviour.

Systems iterate over sets of particles every frame and advance their values accordingly to their behaviour.

A BufferGeometry reads the values and puts them into its attributes. Vertex and fragment shader uses them to appropriate display each particle.

## Performance

By putting all the data into one BufferGeometry it takes only one drawcall disregarding how many particles you display.

Theres a spritesheet option to put all textures into one file and let each particle use another image.

## Examples

Go to ```/examples``` install the packages and run ```npm run dev``` to show them in your browser.

## Changelog

### v0.0.1 27-3-22
* Refactored particle rendering to plain three.js geometry and material

### v0.0.0 24-3-22
* Initial setup 
