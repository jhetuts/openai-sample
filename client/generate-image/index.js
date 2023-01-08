import bot from '../assets/bot.png';
import user from '../assets/user.png';

// const API_URL = 'https://open-ai-test-yg1v.onrender.com/generate-image'
const API_URL = 'http://localhost:5000/generate-image'
const form = document.querySelector('#generate-image-form');
const chatContainer = document.querySelector('#chat-container')

let loadInterval;

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.'

        if(element.textContent === '....')
        element.textContent = '';
    }, 300)
}

function typeText(element, images) {
    element.innerHTML = ''
    if(images && images.length) {
        let listOfimages = ''
        for(let i = 0; i< images.length; i++) {
            listOfimages+= `<p key="${i}"><img src="${images[i].url}" alt="" /><a href="${images[i].url}" target="_blank">Open in new tab</a></p>`
        }
        element.innerHTML = `
            <div class="response-images">
                ${listOfimages}
            </div>
        `
        console.log(element.innerHTML)
    }

    setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" }), 2000)
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id="${uniqueId}">${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    if(!data.get('prompt')) return alert('Please enter something first!')

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const images = data.bot.data

        typeText(messageDiv, images)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    console.log(e)
    if (e.keyCode === 13) {
        
        e.preventDefault()
        handleSubmit(e)
    }
})