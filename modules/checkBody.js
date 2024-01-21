function checkBody(body, keys) {
    let isValid = true;

    for (const field of keys) {
        if (typeof body[field] === 'undefined' || body[field] === null) {
            isValid = false;
        }
    }
    return isValid;
}

module.exports = { checkBody };