const searchIcon = document.querySelector('.icon')
const searchForm = document.querySelector('.search-form')
const searchInput = searchForm.querySelector('.search')
const hotSongsContainer = document.querySelector('.hot-songs .container')
const showLyricsSection = document.querySelector('.show-lyrics')
const showLyricsContainer = showLyricsSection.querySelector('.container')
const searchSongsSection = document.querySelector('.search-songs')
const searchSongsContainer = searchSongsSection.querySelector('.search-songs .songs')

searchIcon.addEventListener('click', () => {
    searchInput.classList.toggle('visible')
})

const getHotSongs = async () => {
    preloader('show')
    const response = await fetch(`https://api-song-lyrics.herokuapp.com/hot`)
    const result = await response.json()
    const lyrics = await result
    showHotSongs(lyrics.data)
    preloader('hide')
}

const showHotSongs = (songs) => {
    songs.slice(80).forEach((song) => {
        let songCompHTML = `<div class="song-comp" data-link="${song.songLyrics}" onclick="getLyrics(this)">
        <h1 class="title d-inline-block">${song.songTitle}</h1>
        <p class="text-grey">${song.artist}</p>
    </div>`
        hotSongsContainer.innerHTML += songCompHTML
    })
}

const getLyrics = async (el) => {
    let songLink = el.getAttribute('data-link')
    // Fetch single song to get lyrics
    preloader('show')
    const response = await fetch(songLink)
    const result = response.json()
    const song = await result
    showLyrics(song.data)
    preloader('hide')
}

const showLyrics = (song) => {
    showLyricsSection.style.zIndex = '3'
    let lyricsArr = []
    song.songLyricsArr.forEach((lyrics) => {
        lyricsArr.push(lyrics)
    })
    showLyricsSection.classList.add('open')
    document.body.style.overflowY = 'hidden'
    showLyricsContainer.innerHTML = `<a role="button" class="text-link btn-back" data-on="lyrics" onclick="backToPrevious(this)">Back</a>
    <h1 class="title mt-12">${song.songTitle}</h1>
    <p class="text-grey">${song.artist}</p>
    <p class="lyrics">${lyricsArr.join('<br>')}</p>`
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let searchValue = searchInput.value
    getSearchSongs(searchValue)
})

const getSearchSongs = async (keyword) => {
    preloader('show')
    const response = await fetch(`https://api-song-lyrics.herokuapp.com/search?q=${keyword}`)
    const result = await response.json()
    const songs = await result
    showSearchSongs(songs.data, keyword)
    preloader('hide')
}

const showSearchSongs = (songs, keyword) => {
    showLyricsSection.style.zIndex = '-1'
    searchInput.classList.remove('visible')
    searchSongsSection.classList.add('open')
    document.body.style.overflowY = 'hidden'
    searchSongsContainer.innerHTML = ''
    let heading = searchSongsSection.querySelector('.heading')
    heading.innerText = `Keyword: ${keyword}`
    songs.forEach((song) => {
        let songCompHTML = `<div class="song-comp" data-link="${song.songLyrics}" onclick="getLyrics(this)">
        <h1 class="title d-inline-block">${song.songTitle}</h1>
        <p class="text-grey">${song.artist.slice(1)}</p>
    </div>`
        searchSongsContainer.innerHTML += songCompHTML
    })
}

const backToPrevious = (el) => {
    if (el.getAttribute('data-on') === 'lyrics') {
        showLyricsSection.classList.remove('open')
        showLyricsSection.style.zIndex = '2'
    } else {
        searchSongsSection.classList.remove('open')
        showLyricsSection.style.zIndex = '2'
    }
    document.body.style.overflowY = 'scroll'
}

const preloader = (condition) => {
    const preloader = document.querySelector('.preloader')
    if(condition === 'show') {
        preloader.classList.add('show')
    } else {
        preloader.classList.remove('show')
        preloader.style.pointerEvents = 'none'
    }
}

getHotSongs()