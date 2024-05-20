function adjustHeight(element) {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
}

function copyToClipboard() {
    let outputHTML = document.getElementById('output').innerHTML;
    let formattedText = outputHTML.replace(/<br\s*\/?>/gi, '\r\n');

    navigator.clipboard.writeText(formattedText).catch(err => {
    });
}

function clearInput() {
    const inputBox = document.getElementById('inputBox');
    inputBox.value = '';
    document.getElementById('output').textContent = '';
    adjustHeight(inputBox);
}

function setDelimiter(delimiter) {
    currentDelimiter = delimiter;
    sortIPs();
}

function sortIPs() {
    const input = document.getElementById('inputBox').value;
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/\d{1,2})?$/;
    const ipArray = input.split(/\s+|,|;|\n/).filter(ip => ipRegex.test(ip));
    const uniqueIPs = [...new Set(ipArray)];

    uniqueIPs.sort((a, b) => {
        const cidrA = a.includes('/');
        const cidrB = b.includes('/');
        if (cidrA !== cidrB) {
            return cidrA ? -1 : 1;
        }
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    document.getElementById('output').innerHTML = uniqueIPs.join(currentDelimiter.replace(/\\r\\n/g, '<br>'));
}

document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('inputBox');
    inputBox.addEventListener('input', sortIPs);
    adjustHeight(inputBox);
    sortIPs();

    document.querySelectorAll('.delimiter-button').forEach(button => {
        button.addEventListener('click', () => setDelimiter(button.getAttribute('data-delimiter')));
    });
});

let currentDelimiter = '; ';
