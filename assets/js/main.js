/*
1. Render sessions
2. Scroll top
3. Play / pause / seek
4. CD rotate
5. Next / prev
6. Random
7. Next / Repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click
*/

const PLAYER_STORAGE_KEY = 'MUSIC-PLAYER'
const $ = document.querySelector.bind(document)
const $$= document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');
const playIcon = $('.fa-play');
const pauseIcon = $('.fa-circle-pause');
const progress = $('#progress');
const playlist = $('.playlist')

// const 
// const 
// const 

window.onload = function() {
    var dashboard = document.querySelector('.dashboard');
    var playlist = document.querySelector('.playlist');
    var dashboardHeight = dashboard.offsetHeight;
    playlist.style.top = dashboardHeight + 'px';
};
const app = {
    currentIndex: 0,
    isPlaying : false,
    isRandom: false,
    isRepeat: false,
    shuffleArr:[],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Faded',
            singer: 'Alan Walker',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.png'
        },
        {
            name: 'This is what you came for',
            singer: 'Calvin Harris // Rihanna',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.png'
        }, {
            name: 'La la la',
            singer: 'Naughty boy',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.png'
        }, {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Dusk till dawn',
            singer: 'Zayn',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.png'
        }, {
            name: 'Attention',
            singer: 'Charlie Puth',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.png'
        }, {
            name: 'Despasito',
            singer: 'Luis Fonsi',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng - MTP',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        }, {
            name: 'Losing internet',
            singer: 'passion',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        }, {
            name: 'Three for you',
            singer: 'Martin Garrix & Troye sivan',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.png'
        },
        {
            name: 'Wole',
            singer: 'Cris Heria',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.jpg'
        }, {
            name: 'Ngôi nhà hạnh phúc',
            singer: 'Nhật Phát',
            path: './assets/music/song12.mp3',
            image: './assets/img/song12.jpg'
        }, {
            name: 'Closer',
            singer: 'The Chainsmokers ft.Halsey',
            path: './assets/music/song13.mp3',
            image: './assets/img/song13.png'
        },
        {
            name: 'Kusanagi',
            singer: 'ODESZA',
            path: './assets/music/song14.mp3',
            image: './assets/img/song14.png'
        },
    ],
    setConfig: function(key,value){
        this.config[key] =  value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render: function() {
        
        const htmls = this.songs.map((song,index) =>{
            return `<div class="song song-${index} ${index === this.currentIndex ? 'active-song':''}" data-index = ${index}>
                <div class="thumb" 
                    style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="singer">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>`
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){

        const _this =this
        //xử lý CD quay/dừng
        const cdThumbAnimate = cdThumb.animate(
            [{transform:'rotate(360deg)'}],
            {
                duration:10000,
                iterations: Infinity
            }
        )
        cdThumbAnimate.pause()
        //xử lý phóng to thu nhỏ cd
        const cd = $('.cd-thumb')
        const cdWidth = cd.offsetWidth
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
           const newCdWidth = cdWidth - scrollTop

           cd.style.width = newCdWidth > 0 ? newCdWidth + 'px':0
           cd.style.height = newCdWidth > 0 ? newCdWidth + 'px':0
           cd.style.opacity = newCdWidth/cdWidth
        }

        //xử lý khi click play
        playBtn.onclick =function(){
            // Toggle class to hide/show icons
            playIcon.classList.toggle('hidden');
            pauseIcon.classList.toggle('hidden');
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        //khi song được play
        audio.onplay =function(){
            _this.isPlaying = true
            cdThumbAnimate.play()
        }

        //khi song bị pause
        audio.onpause =function(){
            _this.isPlaying = false
            cdThumbAnimate.pause()
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const  progressPercent = Math.floor(audio.currentTime/audio.duration*100)
                progress.value = progressPercent
            }
        }

        //xử lý khi tua song
        progress.oninput = function(e){
            const seekTime = e.target.value / 100 * audio.duration
            progress.value = seekTime
            audio.currentTime =seekTime

        }

        //xử lý khi click next button
        nextBtn.onclick = function(){
            _this.checkPause()
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            
            audio.play()
            _this.scrollToActiveSong()
        }

        //xử lý khi click prev button
        prevBtn.onclick = function(){
            _this.checkPause()
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.scrollToActiveSong()
        }

        //xử lý random button
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active')
        }

        //xử lý lặp lại song

        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active')
        }

        //xử lý khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        // lắng nghe hành vi khi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active-song)')
            

            if(songNode || e.target.closest('.option')){
                //xử lý khi click vào song

                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.handleSongActive(_this.currentIndex)
                    _this.checkPause()
                }
            }
        }
    },
    loadCurrentSong: function(){
        

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom || false
        this.isRepeat = this.config.isRepeat || false
        repeatBtn.classList.toggle('active',this.isRepeat)
        randomBtn.classList.toggle('active',this.isRandom)
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        this.handleSongActive( this.currentIndex)
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex <0 ){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
        this.handleSongActive( this.currentIndex)
    },
    playRandomSong:function(){
        let newIndex 
        do {
            newIndex = Math.floor(Math.random()* this.songs.length)
        }while( this.currentIndex === newIndex || this.shuffleArr.includes(newIndex))
        if(this.shuffleArr.length == this.songs.length - 1){
            this.shuffleArr = []
        }
        this.shuffleArr.push(newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        this.handleSongActive( this.currentIndex)
    },
    handleSongActive: function(index){
        $('.active-song').classList.remove('active-song')
        $(`.song-${index}`).classList.add('active-song')
    },
    checkPause: function(){
        if(!playIcon.classList.contains('hidden')){
            playIcon.classList.toggle('hidden');
            pauseIcon.classList.toggle('hidden');
        }
    },
    scrollToActiveSong:function(){
        setTimeout(() =>{
            $('.song.active-song').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
        },100)
    },
    start: function() {
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        //định nghĩa các thuộc tính cho object
        this.defineProperties()
        //lắng nghe sử lý các sự kiện (Dom Events)
        this.handleEvents()
        //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng lần đầu
        this.loadCurrentSong()
        //Render playlist
        this.render()
    }

    
}
app.start()