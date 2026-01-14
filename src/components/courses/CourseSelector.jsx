import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Check, 
  X, 
  BookOpen, 
  Users as UsersIcon,
  Clock,
  Award,
  ExternalLink
} from 'lucide-react';
import { useCourses } from '../../hooks/useCourses';
import toast from 'react-hot-toast';

const CourseSelector = () => {
  const {
    myCourses,
    searchQuery,
    setSearchQuery,
    filterCredits,
    setFilterCredits,
    getFilteredCourses,
    addCourse,
    removeCourse,
    getTotalCredits
  } = useCourses();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const filteredCourses = getFilteredCourses();

  const isCourseAdded = (courseCode) => {
    return myCourses.some(c => c.code === courseCode);
  };

  const handleAddCourse = (course) => {
    const result = addCourse(course.code);
    if (result.success) {
      toast.success(`Added ${course.code}`);
    } else {
      toast.error(result.error);
    }
  };

  const handleRemoveCourse = (course) => {
    removeCourse(course.code);
    toast.success(`Removed ${course.code}`);
  };

  const creditOptions = [2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
          <p className="text-gray-600">
            Add courses to your schedule • Total Credits: {getTotalCredits()}
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by course code, name, or instructor..."
                className="input-field pl-10 w-full"
              />
            </div>

            {/* Credits Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterCredits || ''}
                onChange={(e) => setFilterCredits(e.target.value ? parseInt(e.target.value) : null)}
                className="input-field w-40"
              >
                <option value="">All Credits</option>
                {creditOptions.map(credit => (
                  <option key={credit} value={credit}>{credit} Credits</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course List */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-sm text-gray-600">
              Showing {filteredCourses.length} courses
            </p>

            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => {
                const isAdded = isCourseAdded(course.code);
                
                return (
                  <motion.div
                    key={course.code}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    className={`card cursor-pointer transition-all ${
                      selectedCourse?.code === course.code
                        ? 'ring-2 ring-primary-500'
                        : ''
                    } ${isAdded ? 'bg-primary-50 border-primary-200' : ''}`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {course.code}
                          </h3>
                          <span className="badge badge-primary">
                            {course.credits} Credits
                          </span>
                          {isAdded && (
                            <span className="badge bg-green-100 text-green-800">
                              <Check size={14} className="inline mr-1" />
                              Added
                            </span>
                          )}
                        </div>
                        
                        <h4 className="text-base text-gray-700 mb-3 font-medium">
                          {course.name}
                        </h4>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          {course.instructors.length > 0 && (
                            <div className="flex items-center gap-1">
                              <UsersIcon size={14} />
                              <span>{course.instructors.join(', ')}</span>
                            </div>
                          )}
                          
                          {course.lecture.slots.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>Lecture: {course.lecture.slots.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {isAdded ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCourse(course);
                            }}
                            className="btn-secondary flex items-center gap-2"
                          >
                            <X size={16} />
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddCourse(course);
                            }}
                            className="btn-primary flex items-center gap-2"
                          >
                            <Plus size={16} />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredCourses.length === 0 && (
              <div className="card text-center py-12">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No courses found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Course Details Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            {selectedCourse ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Course Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-2xl font-bold text-primary-600 mb-1">
                      {selectedCourse.code}
                    </h4>
                    <p className="text-gray-700 font-medium">{selectedCourse.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Credits</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedCourse.credits}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Capacity</p>
                      <p className="text-lg font-bold text-gray-900">
                        {selectedCourse.capacity || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {selectedCourse.instructors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Instructors
                      </p>
                      <div className="space-y-1">
                        {selectedCourse.instructors.map((instructor, idx) => (
                          <p key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <UsersIcon size={14} />
                            {instructor}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.lecture.slots.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Lecture Slots
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.lecture.slots.map((slot) => (
                          <span key={slot} className="badge badge-primary">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.tutorial.slots.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Tutorial Slots
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.tutorial.slots.map((slot) => (
                          <span key={slot} className="badge bg-purple-100 text-purple-800">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.lab.slots.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Lab Slots
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.lab.slots.map((slot) => (
                          <span key={slot} className="badge bg-orange-100 text-orange-800">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCourse.link && (
                    <a
                      href={selectedCourse.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline w-full flex items-center justify-center gap-2 mt-4"
                    >
                      <ExternalLink size={16} />
                      Course Plan
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="card text-center py-12">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Select a course to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSelector;