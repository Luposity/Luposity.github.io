const copyBtn = document.getElementById('copyBtn');
const copyText = document.getElementById('copyText');

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(copyText.textContent).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    }).catch(() => {
        copyBtn.textContent = 'Failed';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    });
});