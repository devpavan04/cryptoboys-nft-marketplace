import React, { Component, useState, setState, useEffect } from "react";
import Select from "react-select"

const FilterBar = ( { 
    traits, 
    traitsTypes,
    handleFilterBar
    } ) => {

    const [loading, setLoading] = useState(false);
    return (
        <div className="filterBar align-items-right d-flex justify-content-right spaced">
            {  traitsTypes.length > 0 ?
                traitsTypes.map( (type, i ) => {
                    const items = traits[traitsTypes[i]].map( (value, key) => {
                        let valueKey = type + '_' + value.replace(' ', '-');
                        return { value: valueKey, label: value }
                    })
                    return (
                        items &&
                        <div key={i}>
                            <span>{type}</span>
                            <Select 
                                options={items}
                                onChange={handleFilterBar}
                                key={i}
                                placeholder="None"
                            />
                        </div>
                    )

                })
                : 'Loading Skulls traits...' }
        </div>
    );
};

export default FilterBar;
/**
 *        <FilterSelect
                            traits={traits}
                            type={type}
                            key={i}
                        />
 */
