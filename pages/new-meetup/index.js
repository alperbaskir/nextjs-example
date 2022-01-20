// yourdomain.com/new-meetup
import NewMeetupForm from '../../components/meetups/NewMeetupForm'
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import Head from 'next/head'

const NewMeetupPage = ()=> {
    const router = useRouter();
    const addMeetupHandler = async (enteredMeetup) => {
        const response = await fetch('/api/new-meetup', {
            method: 'POST',
            body: JSON.stringify(enteredMeetup),
            headers: {
                'Content-Type': 'application/json'
            } 
        });
        const data =  await response.json();
        console.log(data);
        router.push('/')
    }
    return (
        <Fragment>
            <Head>
                <title>Add an new Meetup</title>
                <meta name='description' 
                content='Add your own meetups'
                />
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler}/>
        </Fragment>
    
    );
}

export default NewMeetupPage;