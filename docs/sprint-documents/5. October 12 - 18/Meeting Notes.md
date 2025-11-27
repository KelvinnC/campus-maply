
## Sprint Meeting Review
**Meeting Date**: Friday, October 10 
**Attendees**: All

---
### Status of deliverables
**Completed this week:**
- User requirements (Students/Visitors, Administrators, Event Coordinators, Faculty/Staff) 
- Technical requirements (Frontend, Backend, Database, API & Integration)

**In progress:**
- UI/UX mockups (Map, Event Manager, Building Room List, Event List) in Figma.

---

### Changes in Scope 
No changes in scope were made during this week.

### Change Requests 
No change requests were made during this week.

---

### Decision(s) Made
- We decided on our tech stack. 
    - React for frontend, 
    - Javascript with Node JS for the backend. 
    - We will use SQLite for the database. 
    - To work with the map we will use Leaflet, a third party JS library for interactive map.


### Risks and Issues


- **Risk:** Delay in backend development  
  **Likelihood:** Medium
  **Impact:** High
  **Mitigation:** Ensure group members know their responsibilities; monitor progress daily. Meet and check progress next week.

- **Risk:** Key team members less available due to academic stressors 
  **Likelihood:** High
  **Impact:** Medium
  **Mitigation:** Assign deliverables to other team members with more open schedule; adjust due dates if necessary. 

- **Risk:** Data quality or availability issues regaurding room schedule
  **Likelihood:** High
  **Impact:** Low
  **Mitigation:** Use sample data if data is unavailable.

---

## Project Status Meeting
**Meeting Date**: Friday, October 17  
**Meeting Type**: Virtual  
**Attendees**: All

---

### Action Items
- Overview of last week's activity and this week's assigned items
- James requested documentation for APIs
- Store data in `seed.sql`
- Update schema as required
- Focus on gathering GPS and attribute data for buildings, attribute data for rooms, washrooms, bus stops, and parking lots

### Decisions Made
- Rooms and buildings should be separate in the database, to be done later on in the project
- We are not generating room lists for residences

