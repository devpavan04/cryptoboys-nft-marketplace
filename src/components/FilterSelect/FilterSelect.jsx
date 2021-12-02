import React, { Component, useState, setState, useEffect } from "react";

const FilterSelect = ( { 
    traits,
    type,
    key
    } ) => {

    let typeKey = type.replace(' ', '-')
    return (
        <div>
            {  ( traits && type ) ?
                <select key={key} >
                { traits.map( (value, key) => {
                    let valueKey = value.replace(' ', '-');
                    return (
                        <option key={key} value={valueKey}>{value}</option>
                    )
                }) }
                </select>
            : 'no traits '}
        </div>
    );
};

export default FilterSelect;
