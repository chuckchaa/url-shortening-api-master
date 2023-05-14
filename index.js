document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn')
    const menuMobile = document.querySelector('.menu-mobile')
    const header = document.querySelector('header')

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('menu--open')
        menuMobile.classList.toggle('menu--open')
    })

    document.addEventListener('scroll', () => {
        let posTop =
            window.pageYOffset !== undefined
                ? window.pageYOffset
                : (
                      document.documentElement ||
                      document.body.parentNode ||
                      document.body
                  ).scrollTop

        if (posTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
        } else {
            header.style.backgroundColor = 'transparent'
        }
    })

    const form = document.querySelector('form')
    const input = document.querySelector('input')
    const error = document.querySelector('.input__error')
    const actions = document.querySelector('.action__inner')

    function setError(message) {
        input.classList.add('input--error')
        error.textContent = message
    }

    function removeError() {
        input.classList.remove('input--error')
        error.textContent = ''
    }

    function resetAllCopyBtns() {
        const copyBtns = document.querySelectorAll('.item__copy')
        copyBtns.forEach(copyBtn => {
            copyBtn.classList.remove('item__copy--copied')
            copyBtn.textContent = 'Copy'
        })
    }

    form.addEventListener('submit', e => {
        e.preventDefault()

        const url = input.value

        if (!url) {
            setError('Please add a link')
        } else {
            shortenUrl(url)
        }
    })

    async function shortenUrl(url) {
        try {
            const data = await fetch(
                `https://api.shrtco.de/v2/shorten?url=${url}`
            ).then(res => res.json())

            if (data.ok) {
                removeError()

                const newItem = document.createElement('div')
                newItem.classList.add('action__item')
                newItem.classList.add('item')

                newItem.innerHTML = `
                <div class="item__url url">${data.result.original_link}</div>
                <div class="item__actions">
                  <div class="item__url url url--blue">${data.result.full_short_link3}</div>
                </div>
                `

                const copyBtn = document.createElement('button')
                copyBtn.classList.add('item__copy')
                copyBtn.classList.add('button')
                copyBtn.classList.add('button--small')
                copyBtn.textContent = 'Copy'

                copyBtn.addEventListener('click', () => {
                    resetAllCopyBtns()
                    navigator.clipboard.writeText(data.result.full_short_link3)
                    copyBtn.classList.add('item__copy--copied')
                    copyBtn.textContent = 'Copied!'
                })

                const itemActions = newItem.querySelector('.item__actions')

                itemActions.appendChild(copyBtn)
                actions.appendChild(newItem)
                input.value = ''
            } else {
                switch (data.error_code) {
                    case 2:
                        setError('Invalid url')
                        break
                    case 3:
                        setError(
                            'Rate limit reached. Wait a second and try again'
                        )
                        break
                    case 4:
                        setError(
                            'IP-Address has been blocked because of violating our terms of service'
                        )
                        break
                    case 5:
                        setError('shrtcode code (slug) already taken/in use')
                        break
                    case 6:
                        setError('Unknown error')
                        break
                    default:
                        setError('Error')
                }
            }
        } catch (e) {}
    }
})
