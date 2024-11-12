import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { REG_USER,LOG_USER} from '../../lib/queries';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
const  Home=()=>{
    const router = useRouter();
    const [RegisterUser]=useMutation(REG_USER);
  const [isRegistering, setIsRegistering] = useState(false);
  const [SignUser]=useMutation(LOG_USER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    try{
        console.log(name,email,password);
    if (isRegistering) {
        console.log(name,email,password);
        await RegisterUser({
        variables:{
            input:{
            name,
            email,
            password
            }
        }
    });
    alert("Registered Successfully");
      console.log('Registering with', { name, email, password });
    } else {
       const {data}= await SignUser({
            variables:{
                input:{
                    name,
                    email,
                    password
                }
            }
        })
        if (data?.Sign) {  
            console.log(data.Sign.token);
            localStorage.setItem('token',data.Sign.token);
            console.log(data.Sign.token);
            router.push('/Second');
          } else {
            console.log('Sign-in unsuccessful');
          }
    }
    setName('');
    setEmail('');
    setPassword('');
  }
  catch(err){
    console.error(err);
    alert("Invalid Credentials");
  }
}

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        margin: '0 auto',
        mt: 8,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
      }} className='vel'
    >
      <div className='sign'>
        <Typography variant="h5" component="h1" gutterBottom>
          {isRegistering ? 'Register' : 'Sign In'}
        </Typography>
        {isRegistering && (
          <TextField
            label="Name"
            variant="outlined"
            type="text"
            value={name}
            onChange={handleNameChange}
            sx={{ mb: 2 }}
            required className='in'
          />
        )}
        <TextField
        className='in'
          label="Email"
          variant='filled'
          type="email"
          value={email}
          onChange={handleEmailChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
        className='in'
          label="Password"
          variant="filled"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          sx={{ mb: 1 }}
          required
        />
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mb: 2 }}>
          {isRegistering ? 'Register' : 'Sign In'}
        </Button>
        <Button variant="text" color="secondary" onClick={toggleForm} fullWidth>
          {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
        </Button>
      </div>
    </Box>
  );
};

export default Home;
