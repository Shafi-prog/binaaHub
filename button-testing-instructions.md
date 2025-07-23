
# Automated Button Testing Instructions

## Browser Console Testing
1. Open your browser's Developer Tools (F12)
2. Navigate to the page you want to test
3. Copy and paste the following script into the Console tab:

```javascript

    (function() {
      const results = {
        totalButtons: 0,
        clickableButtons: 0,
        nonClickableButtons: 0,
        testedButtons: []
      };

      // Find all button elements
      const buttons = document.querySelectorAll('button, [role="button"], .btn, [type="button"], [type="submit"]');
      results.totalButtons = buttons.length;

      buttons.forEach((btn, index) => {
        const buttonInfo = {
          index,
          tagName: btn.tagName,
          text: btn.textContent?.trim() || btn.getAttribute('aria-label') || '[No text]',
          disabled: btn.disabled,
          hasClickHandler: false,
          hasHref: false,
          isVisible: window.getComputedStyle(btn).display !== 'none',
          className: btn.className
        };

        // Check for click handlers
        const events = getEventListeners ? getEventListeners(btn) : null;
        if (events && events.click) {
          buttonInfo.hasClickHandler = true;
        }

        // Check for href (if it's a link styled as button)
        if (btn.tagName === 'A' && btn.href) {
          buttonInfo.hasHref = true;
        }

        // Determine if clickable
        const isClickable = !btn.disabled && 
                           (buttonInfo.hasClickHandler || 
                            buttonInfo.hasHref || 
                            btn.type === 'submit' ||
                            btn.onclick !== null);

        if (isClickable) {
          results.clickableButtons++;
        } else {
          results.nonClickableButtons++;
        }

        buttonInfo.isClickable = isClickable;
        results.testedButtons.push(buttonInfo);
      });

      return results;
    })();
    
```

4. Press Enter to run the script
5. The script will return an object with detailed button analysis

## Pages to Test
Based on the platform structure, test these key pages:

1. **Login Page**: /auth/login
2. **Register Page**: /auth/register  
3. **Dashboard**: /user/dashboard
4. **Project Creation**: /user/projects/create
5. **Calculator**: /user/comprehensive-construction-calculator
6. **Project Details**: /user/projects/[id]
7. **Settings**: /user/settings
8. **Profile**: /user/profile

## Expected Results
- All buttons should be clickable (isClickable: true)
- Disabled buttons should have disabled: true
- All buttons should have meaningful text or aria-label

## Common Issues to Look For
- Buttons without onClick handlers
- Buttons with pointer-events: none in CSS
- Buttons inside disabled containers
- Missing aria-labels for icon-only buttons
- Form buttons without proper type attributes

## Reporting Issues
If you find non-clickable buttons that should be clickable:
1. Note the page URL
2. Record the button text/description
3. Take a screenshot
4. Check browser console for any JavaScript errors
    