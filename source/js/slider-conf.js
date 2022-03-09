// Slider config
// Configutation for portfolio slider
// Dependency: plugins/tiny-slider 

var slider = tns({
    // Container name
    container: '.portofolio__slider',
    items: 1,
    gutter: 24,
    slideBy: 'page',
    loop: false,
    autoplay: true,
    
    "responsive": {
      "576": {
        "items": 2
      },
      "1200": {
        "items": 3
      }
    },
  
  });