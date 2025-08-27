import styles from './heading.module.css'


interface Props{
    start:string;
    highlight:string;
    end:string;
}

export default function Heading({start, highlight, end}:Props){
    return(
        <h1>{start} <span className={styles.highlight}>{highlight}</span>{end}</h1>
    )
}