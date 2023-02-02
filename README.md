## Class Diagrams

```mermaid
classDiagram
    class VacQService {
        <<Application>>
    }

    class Hospitals {
        <<Resource>>
        ««GET» +getHospital(): Hospital
        ««POST» +createHospital(): Hospital
    }

    VacQService ..> Hospitals: /hospital<br>«PATH»

    class Hospital {
        <<Resource>>
        ««GET» +getHospital() Hospital
        ««PUT» +updateHospital() Hospital
        ««DELETE» +deleteHospital() Hospital
    }

    Hospitals ..> Hospital: /{hospitalId}<br>«PATH»

    class HospitalEntity {
        <<Representation>>
        - name
        - address
        - district
        - province
        - postalCode
        - tel
        - region
    }

    Hospital ..> HospitalEntity: «use»

```

## Sequence Diagrams

```mermaid
sequenceDiagram

actor U as User
participant S as <<javaScript>><br>:server
participant R as <<router>><br>:hospitals
participant C as <<controller>><br>:hospitals
participant M as <<model><br>:Hospital
participant D as <<MongoDB>><br>:hospitals

alt Create Hospital
    U->>+S: req.post('/hospitals')
    S->>+R: app.use('/hospitals', hospitalsRouter)
    R->>+C: createHospital
    C->>+M: create(req.body)
    M->>+D: HospitalSchema
    D-->>-M: hospital
    M-->>-C: hospital
    C-->>-U: response
end

alt Get Hospitals
    U->>+S: req.get('/hospitals')
    S->>+R: app.use('/hospitals', hospitalsRouter)
    R->>+C: getHospitals
    C->>+M: find(req.body)
    M->>+D: HospitalSchema
    D-->>-M: hospitals
    M-->>-C: hospitals
    C-->>-U: response
end

alt Get Hospital
    U->>+S: req.get('/hospitals/:id')
    S->>+R: app.use('/hospitals', hospitalsRouter)
    R->>+C: getHospital
    C->>+M: findById(req.params.id)
    M->>+D: HospitalSchema
    D-->>-M: hospital
    M-->>-C: hospital
    C-->>-U: response
end


alt Put Hospital
            U->>+S: req.put('/hospitals/:id')
    S->>+R: app.use('/hospitals', hospitalsRouter)
    R->>+C: putHospital
    C->>+M: findById(req.params.id)
    M->>+D: HospitalSchema
    D-->>-M: hospital
    M-->>-C: hospital
    C->>+M: update(req.body)
    M->>+D: HospitalSchema
    D-->>-M: hospital
    M-->>-C: hospital
    C-->>-U: response
end

alt Delete Hospital
    U->>+S: req.delete('/hospitals/:id')
    S->>+R: app.use('/hospitals', hospitalsRouter)
    R->>+C: deleteHospital
    C->>+M: findById(req.params.id)
    M->>+D: HospitalSchema
    D-->>-M: hospital
    M-->>-C: hospital
    C->>+M: delete(req.body)
    M->>+D: HospitalSchema
    D-->>-M: hospital
    M-->>-C: hospital
    C-->>-U: response
end
```
