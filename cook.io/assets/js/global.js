
"use strict";

import { fetchData } from "./api.js";

// Add event on multiple elements
// @param {NodeList} $elements NodeList
// @param {String} eventType Event type string
// @param {Function} callback callback function

window.addEventOnElements = ($elements, eventType, callback) => {
    for(const $element of $elements){
        $element.addEventListener(eventType, callback);
    }
}

export const cardQueries = [
    ['field','uri'],
    ['field','label'],
    ['field','image'],
    ['field','totalTime']
];

// skeleton card

export const $skeletonCard=`
    <div class="card skeleton-card">

        <div class="skeleton card-banner">

            <div class="card-body">
                <div class="skeleton card-title"></div>
                <div class="skeleton card-text"></div>
            </div>
        </div>
    </div>
`;


// When click on Saved/bookmark button

const ROOT = 'https://api.edamam.com/api/recipes/v2';

window.saveRecipe = function (element, recipeId){
    const isSaved =window.localStorage.getItem(`cookio-recipe${recipeId}`);
    ACCESS_POINT = `${ROOT}/${recipeId}`;

    if(!isSaved){
        fetchData(cardQueries, function(data){
            window.localStorage.setItem(`cookio-recipe${recipeId}`,JSON.stringify(data));
            element.classList.toggle('saved');
            element.classList.toggle('removed');
        });
        ACCESS_POINT = ROOT;
    }
    else{
        window.localStorage.removeItem(`cookio-recipe${recipeId}`);
        element.classList.toggle('saved');
        element.classList.toggle('removed');
    }
}