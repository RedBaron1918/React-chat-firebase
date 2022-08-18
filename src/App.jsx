import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {useAuthState, useSignInWithGoogle} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import { useState } from 'react';
firebase.initializeApp({
  apiKey: "AIzaSyDl4bfKNV_f0aOTlXUz5mYVqarDWpa4WFA",
  authDomain: "react-chat-824d2.firebaseapp.com",
  projectId: "react-chat-824d2",
  storageBucket: "react-chat-824d2.appspot.com",
  messagingSenderId: "1095574662559",
  appId: "1:1095574662559:web:4cfb8ff9303e774f2e61aa"
})

const auth = firebase.auth()
const firestore = firebase.firestore()


function  SingIn(){
  const useSignInWithGoogle = () =>{
    const provider  = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return(
    <div className='idk'>
    <button onClick={useSignInWithGoogle} className='sign'>Sign in with Google</button>

    </div>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}
function ChatRoom(){
  const messageRef = firestore.collection('messages')
  const query = messageRef.orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(query,{idField: 'id'})
  const [formValue,setFormValue] = useState('')
  const sendMessage  = async (e) =>{
    e.preventDefault()
    const {uid,photoURL} = auth.currentUser
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('')
  }
  return(
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
    </div>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type='submit'>send</button>
    </form>
    </>
  )

}
function ChatMessage(props){
  const {text,uid,photoURL} = props.message
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return(
  <div className={`message ${messageClass}`}>
    <img src={photoURL} alt=""/>
    <p>{text}</p>

  </div>
  )


}
function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header className="App-header">
       <SignOut/>
      </header>

      <section>
        {user ? <ChatRoom/> : <SingIn/>}
      </section>
    </div>
  );
}

export default App;
