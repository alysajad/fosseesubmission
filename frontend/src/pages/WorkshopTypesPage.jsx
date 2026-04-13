import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card, { CardTitle } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import styles from './WorkshopTypesPage.module.css';

export default function WorkshopTypesPage({ data }) {
  const user = data?.user;
  const types = data?.workshopTypes || [];
  const pagination = data?.pagination || {};
  const isInstructor = data?.isInstructor;

  return (
    <>
      <NavBar user={user} isInstructor={isInstructor} />
      <main className={styles.main} id="main">
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.heading}>Workshop Types</h1>
              <p className={styles.subheading}>Explore available scientific computing workshops</p>
            </div>
            {isInstructor && (
              <a href="/workshop/add_workshop_type"><Button variant="primary" size="sm">+ Add Workshop Type</Button></a>
            )}
          </div>

          <div className={styles.grid}>
            {types.map((wt) => (
              <Card key={wt.id} className={styles.workshopCard}>
                <Badge variant="accent">{wt.duration} day{wt.duration !== 1 ? 's' : ''}</Badge>
                <CardTitle className={styles.cardName}>{wt.name}</CardTitle>
                <p className={styles.cardDesc}>{wt.description?.substring(0, 120)}{wt.description?.length > 120 ? '...' : ''}</p>
                <a href={`/workshop/type_details/${wt.id}`}>
                  <Button variant="outline" size="sm" block>View Details</Button>
                </a>
              </Card>
            ))}
          </div>

          {pagination.hasPrev || pagination.hasNext ? (
            <div className={styles.pagination}>
              {pagination.hasPrev && <a href={`?page=${pagination.currentPage - 1}`} className={styles.pageBtn}>&larr; Previous</a>}
              <span className={styles.pageInfo}>Page {pagination.currentPage} of {pagination.totalPages}</span>
              {pagination.hasNext && <a href={`?page=${pagination.currentPage + 1}`} className={styles.pageBtn}>Next &rarr;</a>}
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
