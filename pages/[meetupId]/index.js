// yourdomain.com/[meetupId]
import { Fragment } from "react";
import { MongoClient, ObjectId } from "mongodb";
import Card from "../../components/ui/Card";
import classes from '../../components/meetups/MeetupItem.module.css';
import Head from 'next/head'

const MeetupDetailsPage = (props) => {
    return (
      <Fragment>
        <Head>
          <title>{props.meetupData.title}</title>
          <meta name="description" content={props.meetupData.description} />
        </Head>
        <Card>
          <div className={classes.image}>
            <img src={props.meetupData.image} alt={props.meetupData.title} />
          </div>
          <div className={classes.content}>
            <h3>{props.meetupData.title}</h3>
            <p>{props.meetupData.description}</p>
            <address>{props.meetupData.address}</address>
          </div>
        </Card>
      </Fragment>
    );
}

export const getStaticPaths = async () => {
    // we use this because this page is dynamic one and with this +
    // you can pre-generated you're all possible details pages as a list in advanced
    // otherwise getStaticProps will be crash
    const client = await MongoClient.connect('mongodb+srv://abaskir:pi8V3zMZwddwZFuN@cluster0.v868k.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({}, {_id:1}).toArray();
    client.close();
    return {
        fallback: false, // with this you just support elements of paths array
        paths: meetups.map(meetup=>({params:{meetupId: meetup._id.toString()}}))
    }
}

export const getStaticProps = async (context)=> {
    // you can fetch data for a single meetup
    // you cannot use any react hook in here!!!
    // We used static props becouse this page dosent need to render very often
    const meetupId = context.params.meetupId;
    const client = await MongoClient.connect('mongodb+srv://abaskir:pi8V3zMZwddwZFuN@cluster0.v868k.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)})
    client.close();
    // You cannot find out this console log in the browser
    // because this func works in build time!!!
    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description
            } 
        }
    }
}

export default MeetupDetailsPage;