# Tommy Nicol - Personal Portfolio Website

A responsive, accessible personal portfolio website built with pure HTML, CSS, and JavaScript. This website showcases Tommy's projects, philosophy, and expertise in software development.

## Features

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Dark/Light Theme**: Toggle between dark and light modes with persistent preference storage
- **Accessibility**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- **Performance Optimized**: Minimal dependencies, optimized images, and efficient code
- **Interactive Elements**: Collapsible project sections, smooth animations, and mobile navigation
- **Blog System**: Template-based blog with article pages
- **Contact Form**: Functional contact form with validation

## Project Structure

```
/
├── index.html          # Home page
├── about.html          # About page
├── projects.html       # Projects showcase
├── blog.html           # Blog listing
├── contact.html        # Contact page
├── 404.html           # Error page
├── css/
│   └── main.css       # All styles and responsive design
├── js/
│   └── main.js        # All JavaScript functionality
├── assets/
│   ├── images/        # Image assets
│   └── fonts/         # Font files
└── blog/
    └── *.html         # Individual blog posts
```

## Technical Specifications

### Technologies Used
- **HTML5**: Semantic markup with proper accessibility attributes
- **CSS3**: Custom properties, Grid, Flexbox, and responsive design
- **Vanilla JavaScript**: No frameworks or libraries
- **Google Fonts**: Merriweather (headings) and Roboto (body text)

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance
- Page load time: <2s on 4G connection
- Lighthouse scores: 90+ for Performance, Accessibility, Best Practices, and SEO
- Images optimized for web (WebP format recommended)

## Color Palette

- **Primary**: #006d77 (Deep Teal)
- **Accent**: #ee6c4d (Coral)
- **Background**: #ffffff (White) / #121212 (Dark mode)
- **Secondary Background**: #f8f9fa (Light) / #1e1e1e (Dark mode)

## Typography

- **Headings**: Merriweather (serif)
- **Body**: Roboto (sans-serif)
- **Base font-size**: 16px
- **Line height**: 1.5

## Key Features

### Theme Toggle
- Persistent theme preference using localStorage
- Smooth transitions between light and dark modes
- Accessible button with proper ARIA labels

### Mobile Navigation
- Hamburger menu for mobile devices
- Smooth animations and transitions
- Touch-friendly interface
- Closes on outside click or ESC key

### Collapsible Sections
- Project "thought process" sections expand/collapse
- Smooth height animations
- Keyboard accessible
- Proper ARIA attributes

### Scroll Animations
- Fade-in animations using Intersection Observer
- Respects user's motion preferences
- Graceful degradation for older browsers

### Form Validation
- Client-side validation with user-friendly error messages
- Email format validation
- Required field checking
- Integrates with mailto for form submission

## Development

### Local Development
1. Clone or download the project
2. Open `index.html` in a web browser
3. For local server (recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

### Deployment to GitHub Pages
1. Create a new repository on GitHub
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Select "Deploy from a branch" and choose "main"
5. The site will be available at `https://username.github.io/repository-name`

## Customization

### Content Updates
- Update personal information in HTML files
- Add new projects to `projects.html`
- Create new blog posts in the `blog/` directory
- Update contact information and social links

### Styling Changes
- Modify CSS custom properties in `css/main.css` for colors and spacing
- Update typography by changing font families
- Adjust breakpoints for responsive design

### Adding New Features
- JavaScript functions are modular and well-documented
- Add new interactive elements by extending `js/main.js`
- Follow the existing code patterns and naming conventions

## Accessibility Features

- Semantic HTML5 elements
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Focus indicators
- ARIA labels and attributes
- High contrast ratios
- Responsive text sizing

## Performance Optimizations

- Minimal CSS and JavaScript
- Efficient selectors and animations
- Lazy loading for images (when implemented)
- Debounced scroll event handlers
- Optimized font loading with preconnect

## Browser Compatibility

The website uses modern web standards but includes fallbacks for older browsers:
- CSS Grid with Flexbox fallbacks
- Intersection Observer with graceful degradation
- CSS custom properties with fallback values

## Future Enhancements

- Add more blog posts
- Implement image lazy loading
- Add project screenshots
- Include resume/CV download
- Add search functionality for blog
- Implement analytics tracking
- Add more interactive animations

## License

This project is open source and available under the MIT License.

## Contact

For questions or collaboration opportunities, please use the contact form on the website or reach out through the provided social links.