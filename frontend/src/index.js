let bytes = 0;

const onLoad = () => {
    console.log('Hello World');
}

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const showSize = () => {
    const { files: fileEls } = document.getElementById('file');
    if (!fileEls.length) {
        return;
    }
    const files = Array.from(fileEls);

    const size = files.reduce((acc, file) => {
        return { size: acc.size + file.size}
    }, {size: 0});

    bytes = size.size;
    updateStatus(bytes);
    document.getElementById('upload-area').classList.add('hidden');
    document.getElementById('file-info').classList.remove('hidden');

    const interval = setInterval(() => {
        console.count()
        const result = bytes - 5e6;
        bytes = result < 0 ? 0 : result;
        updateStatus(bytes);
        if (bytes === 0) {
            clearInterval(interval);
        }
    }, 50);
}

const updateStatus = (size) => {
    document.getElementById('file-size').innerText = formatBytes(size);
}

function resetUpload() {
    document.getElementById('file').value = '';
    document.getElementById('upload-area').classList.remove('hidden');
    document.getElementById('file-info').classList.add('hidden');
}

window.onload = onLoad;
window.showSize = showSize;