Update Course Page Content and Layout

1.  **Clean up Content**:
    -   Remove specific duration indicators (e.g., "15 min", "30 min") from all blocks in `curso-prototipo.html`.
    -   Remove the "Mini-ejercicio" section from Block 1.

2.  **Implement Accordion Functionality**:
    -   **HTML Structure**:
        -   Modify each "BLOQUE" container.
        -   Ensure the header (`block-header`) acts as the toggle trigger.
        -   Wrap the remaining content of each block in a generic container (e.g., `<div class="accordion-content">`) to easily show/hide it.
        -   Add a visual indicator (like a chevron or +/-) to the header to show state.
    -   **CSS**:
        -   Add styles to hide `.accordion-content` by default.
        -   Add an `.active` class state to show the content.
        -   Style the header to look clickable (cursor pointer).
    -   **JavaScript**:
        -   Add a simple script to handle the click event on headers, toggling the visibility of the content and the indicator icon.

3.  **Verify**:
    -   Check that time markers are gone.
    -   Check that the mini-exercise is removed.
    -   Test the accordion open/close behavior.
