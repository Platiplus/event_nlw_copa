import Image from 'next/image'

import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImage from '../assets/logo.svg'
import usersAvatarExampleImg from  '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
  usersCount: number
}

export default function Home(props: HomeProps) {
  const [ poolTitle, setPoolTitle ] = useState('')

  function createPool(event: FormEvent) {
    event.preventDefault()
    api.post('/pools', { title: poolTitle })
      .then(response => {
        navigator.clipboard.writeText(response.data.code)
        alert("Bolão criado com sucesso, o código foi copiado para a área de transferência!")
        setPoolTitle('')
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div className="max-w-[1124px] mx-auto grid grid-cols-2 items-center h-screen gap-28">
      <main>
        <Image src={logoImage} alt="NWL Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            value={poolTitle}
            onChange={event => setPoolTitle(event.target.value)}
          />
          <button type="submit" className="bg-yellow-500 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellow-700">
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas
        </p>

         <div className="mt-10 pt-10 border-t border-gray-600 text-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"/>

          <div className="flex items-center gap-6">
          <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
         </div>
      </main>

      <Image src={appPreviewImg} alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" quality={100} />
    </div>
  )
}

export const getStaticProps = async () => {
  const [ 
    poolCountResponse,
    guessCountResponse,
    usersCountResponse,
  ] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
    revalidate: 60
  }
}