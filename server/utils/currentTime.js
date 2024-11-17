module.exports = () => {
    const today = new Date();
    let dateParts = today.toISOString().split('T');
    let datePiece = dateParts[0];
    let timePiece = dateParts[1].substring(0, 8);

    return datePiece + " " + timePiece;
};