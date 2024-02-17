"use strict";

import { fetchData } from "./api.js";
import { $skeletonCard, cardQueries } from "./global.js";
import {getTime} from "./module.js"

// Accordion

const $accordions = document.querySelectorAll("[data-accordion]");

const initAccordion = function($element){
    const $button = $element.querySelector('[data-accordion-btn]');

    let isExpanded = false;
    
    $button.addEventListener('click', function(){
        isExpanded = isExpanded ? false : true;
        this.setAttribute('aria-expanded', isExpanded);
    });
}

for(const $accordion of $accordions) initAccordion($accordion);


// Filter bar toggle for mobile screen

const $filterBar = document.querySelector('[data-filter-bar]');

const $$filterTogglers = document.querySelectorAll('[data-filter-toggler]');

const $overlay = document.querySelector('[data-overlay]');

addEventOnElements($$filterTogglers, 'click', function(){

    $filterBar.classList.toggle('active');
    $overlay.classList.toggle('active');
    const bodyOverflow= document.body.style.overflow;
    document.body.style.overflow = bodyOverflow === 'hidden' ? 'visible' : 'hidden';
});


// FILTER submit and clear

const $filterSubmit = document.querySelector('[data-filter-submit]');
const $filterClear = document.querySelector('[data-filter-clear]');
const $filterSearch = document.querySelector("input[type='search']");

$filterSubmit.addEventListener('click', function(){
    const $filterCheckboxes = $filterBar.querySelectorAll('input:checked');
    const queries = []; //store checked filters

    if($filterSearch.value) queries.push(['q', $filterSearch.value]) //recipe to search in search box store in queries[]

    if($filterCheckboxes.length){
        for(const $checkbox of $filterCheckboxes){
            const key = $checkbox.parentElement.parentElement.dataset.filter; //string

            queries.push([key, $checkbox.value]); //store all filters
        }
    }

    //console.log(queries.join("&").replace(/,/g,'='));;

    window.location = queries.length ? `?${queries.join("&").replace(/,/g,'=')}` : '/recipes.html';
});

// When click on enter search should submit

$filterSearch.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter') $filterSubmit.click();
});

$filterClear.addEventListener('click',function(){
    const $filterCheckboxes = $filterBar.querySelectorAll('input:checked');

    $filterCheckboxes?.forEach(element => element.checked = false);
    $filterSearch.value &&= '';
});


// REQUEST RECIPE AND RENDER IN PAGE

const queryStr = window.location.search.slice(1);
const queries = queryStr && queryStr.split('&').map(i=>i.split('='));



const $gridList = document.querySelector('[data-grid-list]');
const $loadMore = document.querySelector('data-load-more');


const defaultQueries = [
    ['mealType', 'breakfast'],
    ['mealType', 'dinner'],
    ['mealType', 'lunch'],
    ['mealType', 'snack'],
    ['mealType', 'teatime']
];

$gridList.innerHTML = $skeletonCard.repeat(24);
let nextPageUrl = '';

const renderRecipe = data =>{
    data.hits.map((item,index)=>{

        const {
            recipe: {
                image,
                label : title,
                totalTime : cookingTime,
                uri
            }
        }=item;

        const recipeId = uri.slice(uri.lastIndexOf('_') + 1);  //->string

        const isSaved =window.localStorage.getItem(`cookio-recipe${recipeId}`); //{undefined || string}

        const $card = document.createElement('div');

        $card.style.animationDelay = `${100 * index}ms`;

        $card.classList.add('card');

        $card.innerHTML=`
        
            <figure class="card-media img-holder">
                <img src="${image}" width="195" height="195" loading="lazy" alt="${title}" class="img-cover">
            </figure>

            <div class="card-body">
                <h3 class="title-small">
                    <a href="./detail.html?recipe=${recipeId}" class="card-link" >
                        ${title ?? 'Untitled'}
                    </a>
                </h3>

                <div class="meta-wrapper">

                    <div class="meta-item">
                        <span class="material-symbols-outlined" aria-hidden="true">schedule</span>

                        <span class="label-medium">${getTime(cookingTime).time || "<1"} ${getTime(cookingTime).timeUnit}</span>
                    </div>

                    <button class="icon-btn has-state ${isSaved ? 'saved' : 'removed'}" aria-label="Add to saved recipe" onclick="saveRecipe(this, '${recipeId}')" >
                        <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                        <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                    </button>
                </div>


            </div>
        
        `;

        $gridList.appendChild($card);

    });
};


let requestedBefore = false;
fetchData(queries || defaultQueries,data=>{
    console.log(data);

    const {_links : {next}}= data;
    nextPageUrl = next?.href;

    $gridList.innerHTML='';
    requestedBefore=false;
    if(data.hits.length){
        renderRecipe(data);
    }
    else{
        $loadMore.innerHTML = `
        
        <p class="body-medium info-text">        
            No rceipe Found
        </p>

        `;
    }
});

const CONTAINER_MAX_WIDTH = 1200;
const CONTAINER_MAX_CARD = 6;

window.addEventListener('scroll', async e=>{
    if($loadMore.getBoundingClientRect().top < window.innerHeight && !requestedBefore && nextPageUrl){
        $loadMore.innerHTML = $skeletonCard.repeat(Math.round(($loadMore.clientWidth / (CONTAINER_MAX_WIDTH)) * CONTAINER_MAX_CARD));
    }

    requestedBefore = true;

    const /*promise*/ response = await fetch(nextPageUrl);
    const /*object*/ data = await response.json();

    const {_links : {next}}= data;
    nextPageUrl = next?.href;

    renderRecipe(data);
    $loadMore.innerHTML = '';
    requestedBefore = false;

    if(!nextPageUrl) $loadMore.innerHTML = `
    <p class="body-medium info-text">        
        No rceipe Found
    </p>`;
})