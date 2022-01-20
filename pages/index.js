import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from "mongodb";
import { Fragment } from 'react';
import Head from 'next/head'

const HomePage = (props) => {
    return (
        <Fragment>
            <Head>
                <title>React Meetups App</title>
                <meta name='description' 
                content='Browse a huge list of higly active React meetups!'
                />
            </Head>
            <MeetupList meetups={props.meetups}/>
        </Fragment>
        
    ); 
}
// export const getServerSideProps = async (context) => {
//     const req = context.req;
//     const res = context.res;
//     // fetch data from an API
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }
export const getStaticProps = async ()=> {
   const client = await MongoClient.connect('mongodb+srv://abaskir:pi8V3zMZwddwZFuN@cluster0.v868k.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();
    client.close();
    return {
        props: {
            meetups: meetups.map(meetup=>({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString()
            }))
        },
        revalidate: 1
    }
}

export default HomePage;