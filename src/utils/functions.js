import React, { useState, useEffect } from "react";
const NumToEth = (num) => {
    return parseInt( window.web3.utils.fromWei( num.toString(), "ether" ) )
}

export default NumToEth;