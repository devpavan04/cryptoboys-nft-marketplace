import React, { Component, useState, setState, useEffect } from "react";
import Select from "react-select"

const FilterBar = ( { 
    traits, 
    traitsTypes,
    handleFilterBar,
    handleStatusNFTFilter
    } ) => {
    const nftStatusOptions = [{
        value: "all", label: "All"
    },{
        value: "inSale", label: "In Sale"
    },{
        value: "notInSale", label: "Not in Sale"
    },{
        value: "owned", label: "Owned"
    }]
    const [loading, setLoading] = useState(false);
    return (
        <div className="filterBar align-items-right d-flex justify-content-right spaced">
            {  traitsTypes.length > 0 ?
                traitsTypes.map( (type, i ) => {
                    let items = []
                    traits[traitsTypes[i]].forEach( (value, key) => {
                        let valueKey = type + '_' + value.replace(' ', '-');
                        if( ! key )
                          items.push( { value: type + '_none', label: 'None'} );

                        items.push( { value: valueKey, label: value } );
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
                <div>
                    <span>NFT Status</span>
                    <Select
                        options={nftStatusOptions}
                        onChange={handleStatusNFTFilter}
                        placeholder="all"
                    ></Select>
                </div>
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
