document.addEventListener("DOMContentLoaded", () => {
   let [button, form, container, parkinfo, stars, hiking, kayaking, camping, horseback] = document.querySelectorAll("#form, #stargazing, #container, #parkinfo, #parkbutton, #hiking, #camping, #kayaking, #horseback")
   let containerthree = document.getElementById("containerthree")
   let containerfour = document.getElementById("containerfour")


   button.addEventListener("click", (e) => {
    toggleParks(e)
})

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        filter(e.target.input.value)
    })

    let globalData
    let state
    let elements = [stars, hiking, camping, kayaking, horseback] 
        elements.forEach(element => {
         element.addEventListener('click', (e) => {
        filterActivities(e.target.id)
            });
        });

   parkinfo.addEventListener("click", (e) => { 
        parkinfo.className == "hidden" ? parkinfo.className = "nothidden" : parkinfo.className = "hidden"
    })

    fetch(`https://developer.nps.gov/api/v1/parks?api_key=1A1ysntfoonKKUeUWGZEkhfdQacwcXmb9kedUFy4`)
    .then((response) => response.json())
    .then((json) => { 
        console.log(json)
        globalData = json.data
       //   globalData.forEach((park) => createCard(park))
         filter("all")

         
     
         // Render all parks in containerThree on page load
         containerthree.innerHTML = '';
         globalData.forEach(park => createCard(park, 2));
         document.getElementById("label3").innerText = "All Parks";
        
        
        
})

// let contnum = 1


    function filter(data) {
        console.log(data)
        // console.log(contnum)
         let contnum = 1
        state = data
        container.innerHTML = ''
        // contnum == 1 ? container.innerHTML = ' ' : container.innerHTML
        
        if (data == "all") {
            globalData.forEach((park) => createCard(park, contnum))
            label.innerText = `Top parks in The U.S.`
        } else{
        let label = document.getElementById("label")
        label.innerText = `Top parks in ${data}`
        let parks = globalData.filter((park) => park.states == data)
        parks.forEach((park) => createCard(park, contnum))
         }
    }

    // function createCard(park, contnum) {
    //     let card = document.createElement("div")
    //     card.className = "hvr-grow-shadow"
    //     card.id = "card"
    //     card.innerHTML = `
    //             <div id="card-body" class="card-body">
    //                 <h5 class="card-title">${park.name}</h5>
    //                 <h6 class="card-subtitle mb-2 text-body-secondary">${park.states}</h6>
                    
    //             </div>
    // `
    //      let image = document.createElement("img")
    //      image.id = "cardimage"
    //      image.src = `${park.images[0].url}`
    //      image.className = "card-img-top"
    //      image.addEventListener("click", (e) => getCardInfo(e, park))
    //      card.appendChild(image)

    //      let like = document.createElement("span")
    //      like.addEventListener("mouseover", () => {
    //         like.style.color = "yellow";
    //       });
          
    //       like.addEventListener("mouseout", () => {
    //         like.style.color = "pink";
    //       });
    //      like.id = "star"
    //      like.className = "fa fa-star"
    //      like.innerHTML = "&#9733"
    //      like.addEventListener("click", (e) => {likedPark(e, like)})
    //      card.appendChild(like)
    //     if (contnum == 1){
    //     container.appendChild(card)
    //     } else if (contnum == 2) {
            
    //     containerthree.appendChild(card)
    //     } 
    
    // }

    function createCard(park, contnum) {
        const card = document.createElement("div");
        card.className = "card hvr-grow-shadow";
        
        const image = document.createElement("img");
        image.className = "card-image";
        image.src = park.images[0]?.url || "";
        image.alt = park.name;
        image.addEventListener("click", (e) => getCardInfo(e, park));
        card.appendChild(image);
      
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
        cardBody.innerHTML = `
          <h5 class="card-title">${park.name}</h5>
          <p class="card-subtitle">${park.states}</p>
        `;
        card.appendChild(cardBody);
      
        const like = document.createElement("span");
        like.className = "fa fa-star like-btn";
        like.innerHTML = "&#9733;";
        like.addEventListener("click", (e) => likedPark(e, like));
        card.appendChild(like);
      
        if (contnum === 1) {
          container.appendChild(card);
        } else if (contnum === 2) {
          containerthree.appendChild(card);
        }
      }

    


//  function getCardInfo(e, park) {
//     console.log(state)
//     console.log(park.operatingHours[0].standardHours.monday)

//     let scroller = document.createElement("div")
//     scroller.id = "scroll"
//     scroller.className="scrollable-div"

//     parkinfo.className = "nothidden"
//     parkinfo.innerHTML = `
//             <h5  id="infotitle" class="card-title">${park.name}</h5>
//             <img id="infoimage" src="${park.images[0].url}"></img>
//             <img id="infoimage2" src="${park.images[1].url}"></img>
//             <img id="infoimage3" src="${park.images[2].url}"></img>
//             <img id="infoimage4" src="${park.images[3].url}"></img>
//     `

//     let p4 = document.createElement("p")
//     p4.id = "infodetails"
//     p4.textContent = `Description: \n ${park.description}`

//     let p3 = document.createElement("p")
//     p3.id = "infoweather"
//     p3.textContent = `Weather Info: \n ${park.weatherInfo}`

//     let p2 = document.createElement("p")
//     p2.id = "infohours"
//     p2.textContent = ` Operating Hours: \n Monday: ${park.operatingHours[0].standardHours.monday} \n Tuesday: ${park.operatingHours[0].standardHours.tuesday} \n Wednesday: ${park.operatingHours[0].standardHours.wednesday} \n Thursday: ${park.operatingHours[0].standardHours.thursday} \n Friday: ${park.operatingHours[0].standardHours.friday}`
    
//     let p = document.createElement("p")
//     p.id="infoactivities"
//     p.textContent = `Activities: \n`
//     park.activities.forEach((activity) => {
//        p.textContent += " " + activity.name + ", "
//     })
//     console.log(p.innerHTML.length)
//    p.textContent.length > 310 ? p.textContent = p.textContent.slice(0, 310) : p;
//       console.log(p.innerHTML.length)
//       console.log(p.innerHTML)

      
//      scroller.appendChild(p4)
//      scroller.appendChild(p3)
//      scroller.appendChild(p2)
//      scroller.appendChild(p)
//      parkinfo.appendChild(scroller)
// }

// function getCardInfo(e, park) {
//     const modalTitle = document.getElementById("parkInfoTitle");
//     const modalBody = document.getElementById("parkInfoBody");

//     modalTitle.textContent = park.name;

//     modalBody.innerHTML = `
//         <div class="row">
//             ${park.images.map(img => `<div class="col-md-6 mb-2"><img src="${img.url}" class="img-fluid rounded"></div>`).join('')}
//         </div>
//         <p><strong>Description:</strong> ${park.description}</p>
//         <p><strong>Weather Info:</strong> ${park.weatherInfo}</p>
//         <p><strong>Activities:</strong> ${park.activities.map(a => a.name).join(", ")}</p>
//     `;

//     // Show the modal
//     $('#parkInfoModal').modal('show');
// }

function getCardInfo(e, park) {
    const modalTitle = document.getElementById("parkInfoTitle");
    const modalBody = document.getElementById("parkInfoBody");

    modalTitle.textContent = park.name;

    // Format operating hours
    const hours = park.operatingHours[0]?.standardHours;
    const hoursText = hours 
        ? `<p><strong>Operating Hours:</strong><br>
            Monday: ${hours.monday}<br>
            Tuesday: ${hours.tuesday}<br>
            Wednesday: ${hours.wednesday}<br>
            Thursday: ${hours.thursday}<br>
            Friday: ${hours.friday}<br>
            Saturday: ${hours.saturday}<br>
            Sunday: ${hours.sunday}
          </p>`
        : `<p><strong>Operating Hours:</strong> Not available</p>`;

    modalBody.innerHTML = `
        <div class="row">
            ${park.images.map(img => `<div class="col-md-6 mb-2"><img src="${img.url}" class="img-fluid rounded"></div>`).join('')}
        </div>
        <p><strong>Description:</strong> ${park.description}</p>
        <p><strong>Weather Info:</strong> ${park.weatherInfo}</p>
        ${hoursText}
        <p><strong>Activities:</strong> ${park.activities.map(a => a.name).join(", ")}</p>
    `;

    // Show the modal
    $('#parkInfoModal').modal('show');
}

 function filterActivities(data){
    containerthree.innerHTML = ""
    let contnum = 2
    
    let name
    switch (data) {
        case "stargazing":
            name = "Astronomy"
            break
        case "hiking":
             name = "Hiking"
             break
        case "kayaking":
             name = "Kayaking"
            break
        case "camping":
            name = "Camping"
            break
        case "horseback":
            name = "Horseback Riding"
            break
    }
    
   let array = []
    for (let i = 0; i < globalData.length; i++) {
         for(let x = 0; x < globalData[i].activities.length; x++) {
            if (globalData[i].activities[x].name == name) {
                array.push(globalData[i])
            }
                
         }
    }
    let label = document.getElementById("label3")
    label.innerText = `Best parks for ${name}`
    array.forEach((park) => createCard(park, contnum))

}

function likedPark(e, like) {
    const card = e.target.parentNode;

    // If card is already in the saved parks container, remove it
    if (card.parentNode.id === "containerfour") {
        card.remove();
        like.style.color = "pink"; // reset star color
    } else {
        // Otherwise, add to saved parks
        like.style.color = "green";
        containerfour.appendChild(card);
    }
}





function toggleParks(e) {
    if (containerfour.classList.contains("hidden")) {
        containerfour.classList.remove("hidden");
        containerfour.classList.add("nothidden");
    } else {
        containerfour.classList.remove("nothidden");
        containerfour.classList.add("hidden");
    }
}
})
