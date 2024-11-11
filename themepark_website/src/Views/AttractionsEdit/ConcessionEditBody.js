export function ConcessionEditBody({concession, eventKey}) {
    return (
        <div>
            {`Concession ${concession.ConcessionID}: 
            Opens ${concession.OpensAt} 
            OpenFor ${concession.OpenDuration} 
            Located@ ${concession.Location}`}
        </div>
    );
}