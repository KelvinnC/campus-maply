# P2 Project Charter

## Identification

| Field | Value |
|-------|-------|
| **Project Name** | UBCO Interactive Campus Map |
| **Date of Current Version** | September 19, 2025 |
| **Project Sponsor** | Dr. Patricia Lasserre (Instructor), Anuradha Herath (TA) |
| **Project Manager** | Will Kwan (27280890) |

**Team Members:**
- Kelvin Chen (31224231)
- Peter Szabo (93861250)
- James Birnie (35769769)

---

## Background  
Our team has chosen to develop an Interactive Campus Map for UBCO. The platform will allow users to explore the UBCO campus, locate buildings, classrooms, services, and facilities, view detailed information about them, and access information about upcoming events. The overall goal is to create a practical, engaging, and mobile-friendly tool that supports campus navigation and provides timely access to important information, improving the overall campus experience for students, faculty, staff, and visitors.

---

## Objectives  
The purpose of this project is to deliver, within the eight-week project timeline, a functional, interactive UBCO campus map with a room schedule and details viewer that simplifies navigation and helps users to quickly locate classrooms, buildings, and services. The application will feature at least five campus buildings on the map, with each building linked to a room details viewing page. Room schedules will be populated with either sample data or real data if available, and the system will be designed to support dynamic updates. An event listing feature will be included that is capable of displaying updates with a maximum delay of one minute. The platform will also implement role-based access with three levels of permissions: students, faculty and staff, and administrators. It will also be mobile-friendly and accessible, allowing users to easily interact with it from any device. To ensure usability, the team will conduct user testing with at least ten respondents, aiming for a minimum of 80 percent of participants to report that the system is easy to use.

---

## Needs  
Currently, navigation at UBCO relies primarily on static maps and signage, which can be confusing for those unfamiliar with the campus layout. There is no centralized platform that allows users to view both campus locations, building and room details, and upcoming events in one place. As a result, users may spend unnecessary time locating classrooms, services, or events, especially during the first weeks of the term or when room changes occur.   
By providing a single integrated tool, this project will enhance the student and faculty experience, reduce confusion, and promote participation in campus activities. The system will also provide transparency for room usage, helping users plan classes, meetings, or events more efficiently. Overall, the system will improve efficiency by consolidating navigation and event information into a single, easy-to-use interface.

---

## Scope

**In-Scope:** The project will design and deploy a web-based, interactive map. The map will allow users to locate buildings, services, and facilities, and will integrate information about upcoming campus events directly on the map. The platform will feature a dynamic design that is accessible on both desktop and mobile devices. Users will be able to search for buildings, rooms, and events, and apply basic filters to refine their results.

**Out-of-Scope:** The project will not integrate with official room or event booking systems. Real-time GPS navigation beyond location services will also be outside of the scope of this project.

---

## Key Stakeholder Summary

- **Students:**s:** Primary users who will rely on the system for navigation and accessing event information.
- **Faculty and Staff:** Secondary users who may use the platform for navigation or to promote campus events, or to display office or lab information.
- **Club and Event Organizers:** Use the system to display and promote events on campus.
- **Administrators/Department Staff:** May utilize the system to display department-specific information or share important campus information.
- **Sponsors:** Instructor or TA who will provide guidance, support, and approval during the development process.
- **University Services:** Departments like Campus Planning, Campus Services, or Student Services may provide data and support, or may use the platform for displaying department information.
- **Development Team:** Will Kwan, Kelvin Chen, Peter Szabo, James Birnie, responsible for the design, development, testing, and deployment of the system.
- **External Data Providers:** Any source of campus maps, room schedules, or event information.ion.

---

## Project Milestones

### Week 1-2: Requirements Gathering and Planning
- Finalize project charter and scope
- Identify user requirements and technical specifications
- Create initial design mockups for the map and interface

### Week 3-4: Core Development – Map and Login System
- Set up the project repository and hosting environment
- Develop the interactive campus map with basic building markers
- Implement a role-based login system (students, faculty/staff, administrators)

### Week 5: Event Integration and Room Details
- Integrate campus events onto the map
- Implement a room schedule and details viewer using sample or available data
- Add basic search and filter functionality

### Week 6: Usability Testing and Feedback
- Conduct user testing with at least 10 respondents
- Collect feedback on usability, accessibility, and mobile experience
- Identify issues and improvement areas

### Week 7: Refinement and Documentation
- Address feedback and make necessary adjustments to the system
- Finalize documentation and help resources
- Prepare the site for final deployment

### Week 8: Final Deployment
- Deploy the fully functional interactive map online
- Conduct final testing to ensure all features work as intended
- Deliver the product to project sponsors

---

## Major Deliverables

- UI mockup
- Interactive campus map with building and event markers
- Buildings will have different rooms and events when clicking on them from the map in list view
- Search function
- Three different roles: basic user, faculty, and admins
- Logins for faculty and admins
- Ability for faculty and admins to create, edit, and delete events (faculty will have restrictions, admins will not)

---

## Assumptions

- UBCO building and room schedule data may be available for integration; if not, sample/mock data will be used to demonstrate schedule viewing functionality
- Faculty and Admins will upload their events to the websites with the correct details
- Users understand what they are looking for, using proper abbreviations and spellings (e.g., "SUO")
- Project stakeholders will provide timely feedback and approvals
- Internet connectivity will be available across most campus areas
- The developer team will remain committed for the 8-week timeline, working at least 5 hours per week

---

## Constraints

- **Time:** We are limited to 8 weeks of development with around 10 hours of work per week per developer. This limits the number of features we can implement and the overall scope of the project. Moreover, there are only 4 developers working on this project.
- **Data Availability:** Room scheduling, building access, and event data will be limited to open data provided by UBC or third parties.
- **Budget:** $0 budget constraint limits this project to using free/open source resources and affects deployment options.

---

## AI Disclaimer

Portions of this assignment were prepared with the assistance of AI tools, which were used to generate ideas, improve clarity, and refine wording. All content has been critically reviewed, verified, and finalized to ensure accuracy.

---

## Project Charter Acceptance

| Role | Name | Date |
|------|------|------|
| Developer, Project Manager | Will Kwan | Sep 19, 2025 |
| Developer | Kelvin Chen | Sep 19, 2025 12:30 PM PDT |
| Developer | James Birnie | Sep 19, 2025 |
| Developer | Peter Szabo | Sep 19, 2025 12:30 PM PDT |
