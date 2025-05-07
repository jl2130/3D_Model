# Coca-Cola 3D Showcase

An interactive 3D showcase application featuring Coca-Cola brand products with advanced visualization features.

## Features

- Interactive 3D model viewing
- Multiple product models (Coca-Cola Can, Fanta Can, Sprite Can, Coca-Cola Bottle)
- Advanced visualization controls:
  - Wireframe mode toggle
  - Dynamic lighting control
  - Squash animation with 80% compression
  - Camera controls for model inspection
- Responsive design for all screen sizes
- Accessibility features

## Technical Details

### Animation System
- 8-second squash animation cycle
- 80% vertical compression
- Horizontal expansion effect
- Subtle rotation (0.03 radians)
- Smooth easing functions
- Automatic state restoration

### Technologies Used
- Three.js for 3D rendering
- Bootstrap 5 for UI
- GLTFLoader for model loading
- OrbitControls for camera manipulation

## Getting Started

1. Clone the repository
2. Ensure all model files are in the `models` directory
3. Open `index.html` in a modern web browser
4. Use the control panel to interact with the 3D models

## Controls

- **Model Selection**: Choose different product models
- **Wireframe**: Toggle wireframe view
- **Lighting**: Toggle scene lighting
- **Squash**: Activate compression animation
- **Reset View**: Return to default camera position

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance Considerations

- Optimized model loading
- Efficient animation calculations
- Responsive rendering
- Memory-efficient model handling

## Accessibility

- ARIA labels for all controls
- Keyboard navigation support
- High contrast UI elements
- Responsive design for various devices

## License

This project is for demonstration purposes only. All Coca-Cola brand assets are property of The Coca-Cola Company. 