import { createUserWithEmailAndPassword, getAuth,signInWithEmailAndPassword,sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import './App.css';
import app from "./firebase.init";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from "react";

const auth = getAuth(app)
function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('')

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }


  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }

  const handleRegisterdChange = event => {
    setRegistered(event.target.checked) ;
  }
 const  handlePasswordReset = () => {
   sendPasswordResetEmail(auth, email)
   .then(() => {
     console.log('email sent') ;
   })
 }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('Password Should contain at least one special character');
      return;
    }
    setValidated(true);
    setError('')
    if(registered){
      signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user) ;
      })
      .catch(error => {
        console.error(error) ;
        setError(error.message);
      })
    }
    else{
      createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        setEmail('');
        setPassword('');
        verifyEmail() ;
      })
      .catch(error => {
        console.error(error);
        setError(error.message)
      })
    }
    
    event.preventDefault();

  }

  const verifyEmail = () =>{
   sendEmailVerification(auth.currentUser)
   .then(() => {
     console.log('verification sent')
   })

  }
 
  return (
    <div>
      <div className="registration w-50 mx-auto">
        <h2 className="text-primary mt-5"> Please { registered ? 'Login':  'Register'}!!! </h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} required type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label >Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} required type="password" placeholder="Password" />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisterdChange} type="checkbox" label="Already registered?" />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button onClick = {handlePasswordReset} variant="link">Forget Password?</Button>
          <br />
          <Button variant="primary" type="submit">
           {registered ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
