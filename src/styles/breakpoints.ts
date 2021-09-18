const breakpoints = {
  // MAX WIDTHS
  to: {
    // Extra small devices (portrait phones, less than 576px)
    xs: "@media (max-width: 575.98px)",

    // Small devices (landscape phones, less than 768px)
    sm: "@media (max-width: 767.98px)",

    // Medium devices (tablets, less than 992px)
    md: "@media (max-width: 991.98px)",

    // Large devices (desktops, less than 1200px)
    lg: "@media (max-width: 1199.98px)",

    // Extra large devices (large desktops)
    // No media query since the extra-large breakpoint has no upper bound on its width
  },

  // MIN WIDTHS
  from: {
    // Extra small devices (portrait phones, less than 576px)
    // No media query

    // Small devices (landscape phones, 576px and up)
    sm: "@media (min-width: 576px)",

    // Medium devices (tablets, 768px and up)
    md: "@media (min-width: 768px)",

    // Large devices (desktops, 992px and up)
    lg: "@media (min-width: 992px)",

    // Extra large devices (large desktops, 1200px and up)
    xl: "@media (min-width: 1200px)",
  },
  // TARGET DEVICE SIZE
  only: {
    // Extra small devices (portrait phones, less than 576px)
    xs: "@media (max-width: 575.98px)",

    // Small devices (landscape phones, 576px and up)
    sm: "@media (min-width: 576px) and (max-width: 767.98px)",

    // Medium devices (tablets, 768px and up)
    md: "@media (min-width: 768px) and (max-width: 991.98px)",

    // Large devices (desktops, 992px and up)
    lg: "@media (min-width: 992px) and (max-width: 1199.98px)",

    // Extra large devices (large desktops, 1200px and up)
    xl: "@media (min-width: 1200px)",
  },
};

export default breakpoints;
