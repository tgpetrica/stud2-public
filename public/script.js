document.addEventListener('DOMContentLoaded', async () => {
    const buttonColumn = document.getElementById('buttonColumn');
    const contentIframe = document.getElementById('contentIframe');

    const generateRandomColor = () => {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 70;
        const lightness = 50;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const adjustColor = (hslColor, adjustment) => {
        const [hue, saturation, lightness] = hslColor.match(/\d+/g).map(Number);
        const newLightness = Math.min(100, Math.max(0, lightness + adjustment));
        return `hsl(${hue}, ${saturation}%, ${newLightness}%)`;
    };

    try {
        const response = await fetch('/data/content.json');
        const subjects = await response.json();

        Object.keys(subjects).forEach(subject => {
            const subjectColor = generateRandomColor();

            const subjectContainer = document.createElement('div');
            subjectContainer.className = 'subject-container';

            const subjectButton = document.createElement('div');
            subjectButton.className = 'button subject-button';
            subjectButton.innerText = subject;
            subjectButton.style.backgroundColor = subjectColor;

            const subSubjectContainer = document.createElement('div');
            subSubjectContainer.className = 'sub-subject-container';
            subSubjectContainer.style.display = 'none'; // hidden on init

            subjectButton.addEventListener('click', () => {
                subSubjectContainer.style.display = subSubjectContainer.style.display === 'none' ? 'block' : 'none';
            });

            Object.keys(subjects[subject]).forEach(subSubject => {
                const subSubjectColor = adjustColor(subjectColor, 10);

                const subSubjectButton = document.createElement('div');
                subSubjectButton.className = 'button sub-subject-button';
                subSubjectButton.innerText = subSubject;
                subSubjectButton.style.backgroundColor = subSubjectColor;

                const contentButtonContainer = document.createElement('div');
                contentButtonContainer.className = 'content-button-container';
                contentButtonContainer.style.display = 'none'; // hidden on init

                subSubjectButton.addEventListener('click', () => {
                    contentButtonContainer.style.display = contentButtonContainer.style.display === 'none' ? 'block' : 'none';
                });

                subjects[subject][subSubject].forEach(content => {
                    const contentButtonColor = adjustColor(subjectColor, 20);

                    const contentButton = document.createElement('div');
                    contentButton.className = 'button content-button';
                    contentButton.innerText = content.title;
                    contentButton.style.backgroundColor = contentButtonColor;
                    contentButton.addEventListener('click', () => {
                        contentIframe.src = `https://drive.google.com/file/d/${content.fileId}/preview`;
                    });
                    contentButtonContainer.appendChild(contentButton);
                });

                subSubjectContainer.appendChild(subSubjectButton);
                subSubjectContainer.appendChild(contentButtonContainer);
            });

            subjectContainer.appendChild(subjectButton);
            subjectContainer.appendChild(subSubjectContainer);
            buttonColumn.appendChild(subjectContainer);
        });
    } catch (error) {
        console.error('Error fetching links:', error);
    }
});
