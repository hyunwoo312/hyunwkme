type MeshPolygon = {
  className: string
  points: string
}

type GeometricMeshProps = {
  className?: string
}

const meshPolygons: MeshPolygon[] = [
  { className: 'mesh-1', points: '174,142 490,426 86,557' },
  { className: 'mesh-2', points: '811,120 1000,411 709,600 520,309' },
  { className: 'mesh-3', points: '454,122 675,244 627,492 376,523 269,294' },
  { className: 'mesh-4', points: '683,447 840,621 767,845 537,893 380,719 453,495' },
  { className: 'mesh-5', points: '438,541 452,922 115,743' },
  { className: 'mesh-6', points: '600,11 824,125 710,349 486,235' },
  { className: 'mesh-7', points: '249,436 375,591 266,759 73,707 62,507' },
  { className: 'mesh-8', points: '832,418 1011,483 1044,670 898,792 719,727 686,540' },
  { className: 'mesh-9', points: '433,412 680,555 433,698' },
  { className: 'mesh-10', points: '512,27 588,217 398,293 322,103' },
  { className: 'mesh-11', points: '805,47 924,170 844,320 676,291 652,122' },
  { className: 'mesh-12', points: '726,371 823,612 566,576' },
  { className: 'mesh-13', points: '198,671 304,863 112,969 6,777' },
  { className: 'mesh-14', points: '930,206 1015,307 970,431 840,454 755,353 800,229' },
]

export function GeometricMesh({ className = 'geo-lines' }: GeometricMeshProps) {
  return (
    <svg className={className} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000">
      <g className="mesh-group">
        {meshPolygons.map((polygon) => (
          <polygon
            className={`mesh-poly ${polygon.className}`}
            key={polygon.className}
            points={polygon.points}
          />
        ))}
      </g>
    </svg>
  )
}

export function BackgroundMesh() {
  return (
    <div className="bg-mesh" aria-hidden="true">
      <GeometricMesh />
      <div className="bg-grain" />
    </div>
  )
}
