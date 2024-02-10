export function toggleContrast(): void {
    const mainElement = document.getElementById('body-object');
    if (mainElement) {
        const currentTheme = mainElement.getAttribute('data-theme');
        if (currentTheme === 'high-contrast') {
            mainElement.setAttribute('data-theme', '');

            document.querySelectorAll('[data-original-class]').forEach((el: Element) => {
                const originalClass = el.getAttribute('data-original-class');
                //delete class contrast from link object that doesn`t have color class
                if (originalClass === 'link-original') {
                    el.classList.remove('link-contrast');
                    el.removeAttribute('data-original-class');
                //delete class contrast from button object and add color back
                } else if ((originalClass) && (originalClass?.indexOf('btn') !== -1)) {
                    el.classList.remove('btn-contrast');
                    el.classList.add(originalClass);
                    el.removeAttribute('data-original-class');
                //delete class contrast from text object and add color back
                } else if (originalClass) {
                    el.classList.remove('text-contrast');
                    el.classList.add(originalClass);
                    el.removeAttribute('data-original-class');
                }
            });
        } else {
            mainElement.setAttribute('data-theme', 'high-contrast');

            //list of all overwriten classes
            const classListOverwrite = ['text-danger', 'text-success', 'text-success-emphasis', 'text-body-secondary', 'btn-primary', 'btn-outline-success', 'text-light']
            //list of all add to classes
            const classListAddition = ['nav-link', 'text-primary', 'card-title', 'card-text', 'form-label'];

            classListOverwrite.forEach(cls => {
                document.querySelectorAll('.' + cls).forEach((el: Element) => {
                    //overwrite btn classes for specific button contrast
                    if (cls.indexOf('btn') !== -1) {
                        el.setAttribute('data-original-class', cls);
                        el.classList.remove(cls);
                        el.classList.add('btn-contrast');
                    //overwrite color classes for text contrast
                    } else {
                        el.setAttribute('data-original-class', cls);
                        el.classList.remove(cls);
                        el.classList.add('text-contrast');
                    }
                });
            });
            //add contrast to an object without deleting original class
            classListAddition.forEach(cls => {
                document.querySelectorAll('.' + cls).forEach((el: Element) => {
                    if ((cls.indexOf('card') !== -1) || (cls.indexOf('form') !== -1)) {
                        el.classList.add('text-contrast');
                        el.setAttribute('data-original-class', 'link-original');
                    } else {
                        el.classList.add('link-contrast');
                        el.setAttribute('data-original-class', 'link-original');
                    }
                });
            });
        }
    } else {
        console.error('Main element not found');
    }
}