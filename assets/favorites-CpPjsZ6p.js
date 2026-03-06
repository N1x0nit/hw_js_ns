import{i as f,a as _,b as m,h as v,r as b,j as h,o as y}from"./pagination-DHyQxHXB.js";const s=10;let t=1;document.addEventListener("DOMContentLoaded",()=>{f(),_(),m(),r()});function r(){const a=document.getElementById("favorites-content");if(!a)return;const i=v();if(!i.length){a.innerHTML=`
      <div class="favorites-empty">
        <p class="favorites-empty__text">
          It appears that you haven't added any exercises to your favorites yet.
          To get started, you can add exercises that you like to your favorites for easier access in the future.
        </p>
      </div>
    `;return}const l=Math.ceil(i.length/s),n=(t-1)*s,g=i.slice(n,n+s);a.innerHTML=`
    <div class="favorites-grid" id="favorites-grid">
      ${g.map($).join("")}
    </div>
    <div class="pagination" id="favorites-pagination"></div>
  `;const p=a.querySelector("#favorites-pagination");b(p,{currentPage:t,totalPages:l,onPageClick:e=>{t=e,r(),a.scrollIntoView({behavior:"smooth",block:"start"})}}),a.querySelector("#favorites-grid").addEventListener("click",e=>{const o=e.target.closest(".fav-card__delete");if(o){e.stopPropagation(),h(o.dataset.id);const u=v(),c=Math.ceil(u.length/s);t>c&&t>1&&(t=c||1),r();return}const d=e.target.closest(".fav-card");d&&y(d.dataset.id)})}function $(a){return`
    <div class="fav-card" data-id="${a._id}" role="button" tabindex="0" aria-label="Open ${a.name}">
      <div class="fav-card__top">
        <div class="fav-card__badge-wrap">
          <span class="exercise-card__badge">Workout</span>
          <button
            class="fav-card__delete"
            type="button"
            data-id="${a._id}"
            aria-label="Remove ${a.name} from favorites"
          >
            <svg width="16" height="16" aria-hidden="true"><use href="./images/icons.svg#icon-trash"></use></svg>
          </button>
        </div>
        <button class="fav-card__start" type="button" data-id="${a._id}" aria-label="Start ${a.name}">
          Start →
        </button>
      </div>
      <div class="fav-card__title-row">
        <div class="fav-card__icon" aria-hidden="true">
          <svg width="16" height="16"><use href="./images/icons.svg#icon-runner"></use></svg>
        </div>
        <span class="fav-card__name" title="${a.name}">${a.name}</span>
      </div>
      <p class="fav-card__meta">
        Burned calories: <span>${a.burnedCalories||0} / 3 min</span>
        &nbsp;&nbsp;Body part: <span>${a.bodyPart||"—"}</span>
        &nbsp;&nbsp;Target: <span>${a.target||"—"}</span>
      </p>
    </div>
  `}
