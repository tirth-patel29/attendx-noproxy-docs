import { useState } from 'react';
import { Building2, Layers, Users2, BookOpen, GraduationCap, ArrowRight, UserCircle2 } from 'lucide-react';

const hierarchyData = {
  colleges: [
    {
      id: 'depstar',
      name: 'DEPSTAR',
      code: 'D',
      departments: [
        {
          id: 'eng',
          name: 'Engineering',
          code: 'ENG',
          branches: [
            { id: 'ce', name: 'Computer Engineering', code: 'CE' },
            { id: 'cs', name: 'Computer Science', code: 'CS' },
            { id: 'it', name: 'Information Technology', code: 'IT' },
            { id: 'aiml', name: 'AI & Machine Learning', code: 'AIML' }
          ]
        }
      ]
    },
    {
      id: 'cspit',
      name: 'CSPIT',
      code: 'C',
      departments: [
        {
          id: 'eng_c',
          name: 'Engineering',
          code: 'ENG',
          branches: [
            { id: 'ce_c', name: 'Computer Engineering', code: 'CE' },
            { id: 'cs_c', name: 'Computer Science', code: 'CS' },
            { id: 'it_c', name: 'Information Technology', code: 'IT' }
          ]
        }
      ]
    }
  ]
};

const divisions = [
  { id: 'div1', branchId: 'ce', name: 'CE 3rd Year (2024)', academicYear: 2024, batches: ['CE1', 'CE2', 'D2D'] },
  { id: 'div2', branchId: 'ce', name: 'CE 4th Year (2023)', academicYear: 2023, batches: ['CE1', 'CE2', 'CE3'] },
];

export default function AcademicHierarchyPage() {
  const [selectedCollege, setSelectedCollege] = useState<any>(hierarchyData.colleges[0]);
  const [selectedDept, setSelectedDept] = useState<any>(hierarchyData.colleges[0].departments[0]);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [selectedDivision, setSelectedDivision] = useState<any>(null);

  const activeDivisions = selectedBranch ? divisions.filter(d => d.branchId === selectedBranch.id) : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Academic Hierarchy</h1>
        <p className="text-muted-foreground">Interactive drill-down of the deeply-nested academic structure driving AttendX.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border min-h-[500px]">
          
          {/* Level 1: College & Dept */}
          <div className="p-4 bg-muted/10">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-muted-foreground"><Building2 size={16} /> College & Dept</h3>
            <div className="space-y-4">
              {hierarchyData.colleges.map(c => (
                <div key={c.id} className="space-y-2">
                  <div 
                    className={`p-3 rounded-lg border cursor-pointer font-bold transition-colors ${selectedCollege?.id === c.id ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500' : 'bg-background border-border hover:bg-muted text-foreground'}`}
                    onClick={() => { setSelectedCollege(c); setSelectedDept(c.departments[0]); setSelectedBranch(null); setSelectedDivision(null); }}
                  >
                    {c.name} <span className="text-xs font-normal text-muted-foreground ml-2">({c.code})</span>
                  </div>
                  {selectedCollege?.id === c.id && c.departments.map((d: any) => (
                    <div 
                      key={d.id} 
                      className={`ml-6 p-2 rounded-md text-sm cursor-pointer flex items-center justify-between border ${selectedDept?.id === d.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted text-foreground'}`}
                      onClick={() => { setSelectedDept(d); setSelectedBranch(null); setSelectedDivision(null); }}
                    >
                      <span>{d.name}</span>
                      <ArrowRight size={14} className={selectedDept?.id === d.id ? "opacity-100" : "opacity-30"} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Level 2: Branch */}
          <div className="p-4 bg-muted/5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-muted-foreground"><BookOpen size={16} /> Branches</h3>
            {selectedDept ? (
              <div className="space-y-2">
                {selectedDept.branches.map((b: any) => (
                  <div 
                    key={b.id} 
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${selectedBranch?.id === b.id ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-background border-border hover:bg-muted text-foreground'}`}
                    onClick={() => { setSelectedBranch(b); setSelectedDivision(null); }}
                  >
                    <div className="font-medium">{b.name}</div>
                    <ArrowRight size={16} className={selectedBranch?.id === b.id ? "opacity-100" : "opacity-30"} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Select a department</div>
            )}
          </div>

          {/* Level 3: Divisions */}
          <div className="p-4 bg-background">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-muted-foreground"><Layers size={16} /> Divisions</h3>
            {selectedBranch ? (
              <div className="space-y-3">
                {activeDivisions.length > 0 ? activeDivisions.map(div => (
                  <div 
                    key={div.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedDivision?.id === div.id ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-card border-border hover:bg-muted'}`}
                    onClick={() => setSelectedDivision(div)}
                  >
                    <div className="font-bold text-emerald-500 mb-1">{div.name}</div>
                    <div className="text-xs text-muted-foreground mb-3">Academic Year: {div.academicYear}</div>
                    <div className="flex gap-2">
                      {div.batches.map(b => (
                        <span key={b} className="text-xs font-mono bg-muted px-2 py-1 rounded border border-border">{b}</span>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="text-muted-foreground text-sm text-center pt-10">No divisions seeded for this branch.</div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Select a branch</div>
            )}
          </div>

          {/* Level 4: Students Preview */}
          <div className="p-4 bg-muted/10 relative overflow-hidden">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-muted-foreground"><Users2 size={16} /> Roster Preview</h3>
            {selectedDivision ? (
              <div className="space-y-3 relative z-10">
                <div className="bg-background border border-border rounded p-3 flex items-center gap-3">
                  <UserCircle2 size={24} className="text-indigo-500" />
                  <div>
                    <div className="font-medium text-sm">24DCE071</div>
                    <div className="text-xs text-muted-foreground">alice@student.college.edu</div>
                  </div>
                </div>
                <div className="bg-background border border-border rounded p-3 flex items-center gap-3">
                  <UserCircle2 size={24} className="text-indigo-500" />
                  <div>
                    <div className="font-medium text-sm">24DCE072</div>
                    <div className="text-xs text-muted-foreground">bob@student.college.edu</div>
                  </div>
                </div>
                <div className="bg-background border border-border rounded p-3 flex items-center gap-3">
                  <UserCircle2 size={24} className="text-indigo-500" />
                  <div>
                    <div className="font-medium text-sm">24DCE073</div>
                    <div className="text-xs text-muted-foreground">charlie@student.college.edu</div>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-muted/10 to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Select a division</div>
            )}
            
            <GraduationCap className="absolute -bottom-10 -right-10 w-48 h-48 text-muted/20 rotate-12" />
          </div>

        </div>
      </div>
    </div>
  );
}
