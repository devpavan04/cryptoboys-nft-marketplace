let hexString = "0123456789abcdef";
const randomColor = () => {
    let hexCode = "#";
    for(let i=0; i<6; i++){
        hexCode += hexString[Math.floor(Math.random() * hexString.length)];
    }
    return hexCode;
}

const generateGrad = () => {
    let colorOne = randomColor();
    let colorTwo = randomColor();
    let angle = 160;
    return `linear-gradient(${angle}deg, ${colorOne} ,${colorTwo})`;
}

export default generateGrad;
